import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import {
	updateBookingStatus,
	createDamageReport,
	createReview,
	completeReturn,
} from "../services/api";
import {
	fetchRentalRequestsWithDetails,
	getCachedRequests,
	invalidateRequestsCache,
} from "../services/rentalRequestsService";
import { supabase } from "../lib/supabase";
import {
	IconStar,
	IconCheck,
	IconX,
	IconRepeat,
	IconUser,
	IconCalendar,
	IconClock,
	IconMapPin,
	IconAlertTriangle,
	IconPackage,
	IconChevronDown,
	IconChevronUp,
} from "../components/Icons";
import "./WorkflowPage.css";

function RentalRequestsPage() {
	// Initialize with cached requests if preloaded for instant 0ms render
	const [requests, setRequests] = useState(() => {
		const cached = getCachedRequests();
		return cached || [];
	});
	const [message, setMessage] = useState(() => {
		const cached = getCachedRequests();
		return cached ? "" : "Loading booking requests...";
	});
	const [actionError, setActionError] = useState("");
	const [expandedReviews, setExpandedReviews] = useState({});
	const [damageModalBooking, setDamageModalBooking] = useState(null);
	const [reviewModalBooking, setReviewModalBooking] = useState(null);
	const [damageDesc, setDamageDesc] = useState("");
	const [damageCost, setDamageCost] = useState("");
	const [reviewRating, setReviewRating] = useState(5);
	const [reviewComment, setReviewComment] = useState("");
	const [confirmingBookingId, setConfirmingBookingId] = useState(null);

	async function loadRequests(forceRefresh = false) {
		const { data } = await supabase.auth.getSession();
		const lenderId = data.session?.user?.id;

		if (!lenderId) {
			setMessage("Please log in to view requests for your items.");
			return;
		}

		// Instant display if cached
		const cached = getCachedRequests(lenderId);
		if (cached && !forceRefresh) {
			setRequests(cached);
			setMessage("");
		}

		try {
			const requestsWithDetails = await fetchRentalRequestsWithDetails(lenderId, { forceRefresh });
			setRequests(requestsWithDetails);
			setMessage("");
		} catch (error) {
			if (!cached) {
				setMessage(error.response?.data?.message || "Unable to load booking requests.");
			}
		}
	}

	useEffect(() => {
		loadRequests();
	}, []);

	async function reviewRequest(bookingId, status) {
		try {
			setActionError("");
			await updateBookingStatus(bookingId, status);
			invalidateRequestsCache();
			if (status === "APPROVED") {
				alert("Borrow request accepted! Any other pending requests for this item have been automatically rejected.");
			}
			await loadRequests(true);
		} catch (error) {
			setActionError(error.response?.data?.message || "Unable to update this request.");
		}
	}

	async function handleConfirmReturn(bookingId, relist) {
		try {
			setActionError("");
			setConfirmingBookingId(bookingId);
			await completeReturn(bookingId, relist);
			invalidateRequestsCache();
			alert(
				relist
					? "Return confirmed! The item has been marked as returned and relisted into your active catalog."
					: "Return confirmed! The item has been marked as returned and kept unlisted."
			);
			await loadRequests(true);
		} catch (error) {
			console.error("Failed to complete return:", error);
			setActionError(error.response?.data?.message || "Failed to confirm return.");
		} finally {
			setConfirmingBookingId(null);
		}
	}

	const handleDamageReport = async () => {
		if (!damageModalBooking) return;
		try {
			await createDamageReport({
				bookingId: damageModalBooking.bookingId,
				damageDescription: damageDesc,
				damageCost: Number(damageCost) || 0,
				status: "REPORTED",
			});
			setDamageModalBooking(null);
			setDamageDesc("");
			setDamageCost("");
			invalidateRequestsCache();
			alert("Damage report successfully submitted.");
			await loadRequests(true);
		} catch (error) {
			console.error(error);
			alert("Error submitting damage report.");
		}
	};

	const handleReview = async () => {
		if (!reviewModalBooking) return;
		try {
			const { data } = await supabase.auth.getSession();
			await createReview({
				bookingId: reviewModalBooking.bookingId,
				reviewerId: data.session?.user?.id,
				revieweeId: reviewModalBooking.renterId,
				rating: reviewRating,
				comment: reviewComment,
			});
			setReviewModalBooking(null);
			setReviewRating(5);
			setReviewComment("");
			invalidateRequestsCache();
			alert("Review submitted successfully!");
			await loadRequests(true);
		} catch (error) {
			console.error(error);
			alert("Error submitting review.");
		}
	};

	function toggleReviews(bookingId) {
		setExpandedReviews((prev) => ({
			...prev,
			[bookingId]: !prev[bookingId],
		}));
	}

	function getBorrowerRatingDisplay(borrower, reviews) {
		if (reviews && reviews.length > 0) {
			const total = reviews.reduce((sum, r) => sum + Number(r.rating || 0), 0);
			const avg = (total / reviews.length).toFixed(1);
			return {
				avg,
				count: reviews.length,
				label: `${avg} / 5.0 (${reviews.length} ${reviews.length === 1 ? "review" : "reviews"})`,
				badgeClass: avg >= 4 ? "rating-high" : avg >= 3 ? "rating-med" : "rating-low",
				recommendation:
					avg >= 4
						? "Highly rated borrower with verified history"
						: avg >= 3
						? "Moderate rating — check past reviews"
						: "Low rating — review details carefully",
			};
		}

		if (borrower?.rating && Number(borrower.rating) > 0) {
			const score = Number(borrower.rating).toFixed(1);
			return {
				avg: score,
				count: 1,
				label: `${score} / 5.0`,
				badgeClass: score >= 4 ? "rating-high" : "rating-med",
				recommendation: score >= 4 ? "Trusted borrower" : "Check borrower profile",
			};
		}

		return {
			avg: null,
			count: 0,
			label: "New Borrower",
			badgeClass: "rating-new",
			recommendation: "First-time borrower on ShareSpare platform",
		};
	}

	return (
		<div className="workflow-page">
			<Navbar />
			<main className="workflow-content">
				<div className="workflow-heading">
					<div>
						<p className="workflow-kicker">Lender Dashboard</p>
						<h1>Rental Requests</h1>
						<p>Review borrower reliability and manage your rental lifecycle with zero friction.</p>
					</div>
					<Link to="/my-listings" className="workflow-button secondary">
						My Listings
					</Link>
				</div>

				{message && <p className="workflow-message">{message}</p>}
				{actionError && <p className="workflow-message workflow-error">{actionError}</p>}
				{!message && requests.length === 0 && (
					<p className="workflow-message">No rental requests found for your listings.</p>
				)}

				<div className="workflow-list">
					{requests.map((request) => {
						const ratingInfo = getBorrowerRatingDisplay(request.borrower, request.reviews);
						const isReviewsOpen = expandedReviews[request.bookingId];
						const borrowerInitial = request.borrower?.name
							? request.borrower.name.trim()[0].toUpperCase()
							: "U";

						return (
							<article className="workflow-card" key={request.bookingId}>
								{/* Card Top Header */}
								<div className="card-header-row">
									<div className="card-header-left">
										<span className="workflow-label">Booking #{request.bookingId}</span>
										{request.createdAt && (
											<span className="booking-timestamp">
												Requested on {new Date(request.createdAt).toLocaleDateString()}
											</span>
										)}
									</div>
									<strong className={`status status-${request.status.toLowerCase()}`}>
										{request.status}
									</strong>
								</div>

								{/* Card Body */}
								<div className="card-main-content">
									<div className="item-title-row">
										<h2 className="item-title">
											{request.item?.itemName || `Item #${request.itemId}`}
										</h2>
									</div>

									<div className="item-meta-bar">
										<span className="meta-item">
											<IconMapPin size={14} />
											{request.item?.location || "Location not specified"}
										</span>
										<span className="meta-item meta-price">
											₹{request.price || request.item?.rentalPrice || "-"} / hr
										</span>
										{request.item?.securityDeposit != null && (
											<span className="meta-item">
												Deposit: ₹{request.item.securityDeposit}
											</span>
										)}
									</div>

									{/* Borrower Profile Section */}
									<div className="borrower-section">
										<div className="borrower-header">
											<div className="borrower-identity">
												<div className="borrower-avatar">{borrowerInitial}</div>
												<div className="borrower-meta">
													<div className="name-row">
														<h3 className="borrower-name">
															{request.borrower?.name || "Verified Community Member"}
														</h3>
													</div>
													{request.borrower?.location && (
														<span className="borrower-location">
															<IconMapPin size={12} />
															{request.borrower.location}
														</span>
													)}
												</div>
											</div>

											<div className={`rating-pill ${ratingInfo.badgeClass}`}>
												<IconStar size={13} filled={ratingInfo.avg !== null} />
												{ratingInfo.label}
											</div>
										</div>

										{/* Customer Rental History Badges */}
										<div className="trust-badges-row">
											{request.customerHistory?.timesWithLender > 0 ? (
												<span className="repeat-renter-pill">
													<IconRepeat size={13} />
													Repeat Customer: {request.customerHistory.timesWithLender} previous{" "}
													{request.customerHistory.timesWithLender === 1 ? "rental" : "rentals"} from you
												</span>
											) : (
												<span className="first-time-pill">
													<IconUser size={13} />
													First-time borrowing from you
												</span>
											)}

											{request.customerHistory?.totalRentals > 0 && (
												<span className="platform-history-pill">
													• {request.customerHistory.totalRentals} platform{" "}
													{request.customerHistory.totalRentals === 1 ? "rental" : "rentals"} total
												</span>
											)}
										</div>

										<div className="recommendation-note">
											<span>{ratingInfo.recommendation}</span>
										</div>

										{/* Reviews Expand / Collapse */}
										{request.reviews && request.reviews.length > 0 && (
											<div className="reviews-toggle-section">
												<button
													type="button"
													className="toggle-reviews-btn"
													onClick={() => toggleReviews(request.bookingId)}
												>
													{isReviewsOpen ? <IconChevronUp size={13} /> : <IconChevronDown size={13} />}
													{isReviewsOpen
														? "Hide borrower reviews"
														: `View ${request.reviews.length} previous review${
																request.reviews.length > 1 ? "s" : ""
														  }`}
												</button>

												{isReviewsOpen && (
													<div className="reviews-list">
														{request.reviews.map((rev) => (
															<div className="review-card" key={rev.reviewId}>
																<div className="review-card-top">
																	<span className="review-card-stars">
																		<IconStar size={12} filled={true} />
																		{Number(rev.rating).toFixed(1)} / 5.0
																	</span>
																	<small className="review-card-date">
																		{rev.createdAt ? new Date(rev.createdAt).toLocaleDateString() : ""}
																	</small>
																</div>
																{rev.comment && (
																	<p className="review-card-comment">"{rev.comment}"</p>
																)}
															</div>
														))}
													</div>
												)}
											</div>
										)}
									</div>

									{/* Schedule & Duration Grid */}
									<div className="schedule-grid">
										<div className="schedule-block">
											<span className="schedule-label">
												<IconCalendar size={12} />
												Start Time
											</span>
											<span className="schedule-value">
												{new Date(request.startTime).toLocaleString([], {
													dateStyle: "medium",
													timeStyle: "short",
												})}
											</span>
										</div>
										<div className="schedule-block">
											<span className="schedule-label">
												<IconClock size={12} />
												End Time
											</span>
											<span className="schedule-value">
												{new Date(request.endTime).toLocaleString([], {
													dateStyle: "medium",
													timeStyle: "short",
												})}
											</span>
										</div>
									</div>

									{/* Direct 1-Click Return Resolution Section */}
									{request.status === "RETURNED" && (
										<div className="return-streamlined-panel">
											<div className="return-panel-header">
												<h4 className="return-panel-title">
													<IconPackage size={17} />
													Return Verification
												</h4>
												<span className="return-panel-badge">Action Required</span>
											</div>
											<p className="return-panel-desc">
												The borrower has returned this item. Inspect the product and complete the return in one click:
											</p>
											<div className="return-actions-row">
												<button
													className="workflow-button success"
													disabled={confirmingBookingId === request.bookingId}
													onClick={() => handleConfirmReturn(request.bookingId, true)}
													title="Confirm return and make item available again"
												>
													<IconCheck size={14} />
													{confirmingBookingId === request.bookingId
														? "Processing..."
														: "Confirm Return & Relist Item"}
												</button>
												<button
													className="workflow-button secondary"
													disabled={confirmingBookingId === request.bookingId}
													onClick={() => handleConfirmReturn(request.bookingId, false)}
													title="Confirm return but keep item unlisted for now"
												>
													Confirm Return (Keep Unlisted)
												</button>
												<button
													className="workflow-button danger"
													onClick={() => setDamageModalBooking(request)}
												>
													<IconAlertTriangle size={14} />
													Report Issue / Damage
												</button>
												<button
													className="workflow-button star-btn"
													onClick={() => setReviewModalBooking(request)}
												>
													<IconStar size={14} />
													Review Borrower
												</button>
											</div>
										</div>
									)}

									{/* Completed State Banner */}
									{request.status === "COMPLETED" && (
										<div className="completed-alert-banner">
											<span className="completed-badge-text">
												<IconCheck size={16} />
												Return Verified & Rental Completed
											</span>
											<div style={{ display: "flex", gap: "8px" }}>
												<button
													className="workflow-button star-btn sm"
													onClick={() => setReviewModalBooking(request)}
												>
													<IconStar size={13} />
													Review Borrower
												</button>
												<button
													className="workflow-button danger sm"
													onClick={() => setDamageModalBooking(request)}
												>
													<IconAlertTriangle size={13} />
													Report Damage
												</button>
											</div>
										</div>
									)}
								</div>

								{/* Card Bottom Actions (For REQUESTED status) */}
								{request.status === "REQUESTED" && (
									<div className="card-actions-bar">
										<button
											className="workflow-button success"
											onClick={() => reviewRequest(request.bookingId, "APPROVED")}
										>
											<IconCheck size={14} />
											Approve Request
										</button>
										<button
											className="workflow-button danger"
											onClick={() => reviewRequest(request.bookingId, "REJECTED")}
										>
											<IconX size={14} />
											Reject Request
										</button>
									</div>
								)}
							</article>
						);
					})}
				</div>

				{/* Damage Report Modal */}
				{damageModalBooking && (
					<div
						className="modal-overlay"
						onClick={(e) => {
							if (e.target === e.currentTarget) setDamageModalBooking(null);
						}}
					>
						<div className="modal-card">
							<button
								className="modal-close-btn"
								onClick={() => setDamageModalBooking(null)}
								title="Close dialog"
							>
								<IconX size={16} />
							</button>
							<h2>Report Item Damage</h2>
							<p>
								File an incident report for <strong>Item #{damageModalBooking.itemId}</strong> from booking #{damageModalBooking.bookingId}.
							</p>
							<div className="form-group">
								<label>Damage Description</label>
								<textarea
									value={damageDesc}
									onChange={(e) => setDamageDesc(e.target.value)}
									placeholder="Describe the condition, missing parts, or physical defects..."
									rows={3}
								/>
							</div>
							<div className="form-group">
								<label>Estimated Repair / Replacement Cost (₹)</label>
								<input
									type="number"
									value={damageCost}
									onChange={(e) => setDamageCost(e.target.value)}
									placeholder="e.g. 500"
								/>
							</div>
							<div className="modal-actions">
								<button className="workflow-button secondary" onClick={() => setDamageModalBooking(null)}>
									Cancel
								</button>
								<button className="workflow-button danger-solid" onClick={handleDamageReport}>
									Submit Report
								</button>
							</div>
						</div>
					</div>
				)}

				{/* Review Modal */}
				{reviewModalBooking && (
					<div
						className="modal-overlay"
						onClick={(e) => {
							if (e.target === e.currentTarget) setReviewModalBooking(null);
						}}
					>
						<div className="modal-card">
							<button
								className="modal-close-btn"
								onClick={() => setReviewModalBooking(null)}
								title="Close dialog"
							>
								<IconX size={16} />
							</button>
							<h2>Review Borrower</h2>
							<p>Rate and leave feedback for the borrower from booking #{reviewModalBooking.bookingId}.</p>
							<div className="form-group">
								<label>Your Rating</label>
								<div className="star-rating-select">
									{[1, 2, 3, 4, 5].map((star) => (
										<button
											key={star}
											type="button"
											className={`star-btn-pick ${star <= reviewRating ? "active" : ""}`}
											onClick={() => setReviewRating(star)}
											title={`${star} star${star > 1 ? "s" : ""}`}
										>
											<IconStar size={26} filled={star <= reviewRating} />
										</button>
									))}
									<span className="star-score-text">{reviewRating} / 5 Stars</span>
								</div>
							</div>
							<div className="form-group">
								<label>Feedback & Comments</label>
								<textarea
									value={reviewComment}
									onChange={(e) => setReviewComment(e.target.value)}
									placeholder="Respectful borrower, returned item on schedule and in excellent condition!"
									rows={3}
								/>
							</div>
							<div className="modal-actions">
								<button className="workflow-button secondary" onClick={() => setReviewModalBooking(null)}>
									Cancel
								</button>
								<button className="workflow-button" onClick={handleReview}>
									Submit Review
								</button>
							</div>
						</div>
					</div>
				)}
			</main>
		</div>
	);
}

export default RentalRequestsPage;
