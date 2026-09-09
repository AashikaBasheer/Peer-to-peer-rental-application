import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import {
	getBookingsByLender,
	updateBookingStatus,
	getProductById,
	getUserById,
	getReviewsByReviewee,
	createDamageReport,
	createReview,
	completeReturn,
	getCustomerHistory,
} from "../services/api";
import { supabase } from "../lib/supabase";
import "./WorkflowPage.css";

function RentalRequestsPage() {
	const [requests, setRequests] = useState([]);
	const [message, setMessage] = useState("Loading booking requests...");
	const [actionError, setActionError] = useState("");
	const [expandedReviews, setExpandedReviews] = useState({});
	const [damageModalBooking, setDamageModalBooking] = useState(null);
	const [reviewModalBooking, setReviewModalBooking] = useState(null);
	const [damageDesc, setDamageDesc] = useState("");
	const [damageCost, setDamageCost] = useState("");
	const [reviewRating, setReviewRating] = useState(5);
	const [reviewComment, setReviewComment] = useState("");
	const [returnAnswers, setReturnAnswers] = useState({});
	const [confirmingBookingId, setConfirmingBookingId] = useState(null);

	function setReturnAnswer(bookingId, field, val) {
		setReturnAnswers((prev) => ({
			...prev,
			[bookingId]: {
				returned: true,
				relist: true,
				...(prev[bookingId] || {}),
				[field]: val,
			},
		}));
	}

	async function loadRequests() {
		const { data } = await supabase.auth.getSession();
		const lenderId = data.session?.user?.id;

		if (!lenderId) {
			setMessage("Please log in to see requests for your items.");
			return;
		}

		try {
			const lenderRequests = await getBookingsByLender(lenderId);

			const requestsWithDetails = await Promise.all(
				lenderRequests.map(async (request) => {
					let item = null;
					let borrower = null;
					let reviews = [];
					let customerHistory = null;

					try {
						item = await getProductById(request.itemId);
					} catch {
						// ignore
					}

					try {
						if (request.renterId) {
							borrower = await getUserById(request.renterId);
							reviews = await getReviewsByReviewee(request.renterId);
							customerHistory = await getCustomerHistory(lenderId, request.renterId);
						}
					} catch {
						// ignore
					}

					return {
						...request,
						item,
						borrower,
						reviews: reviews || [],
						customerHistory,
					};
				})
			);

			setRequests(requestsWithDetails);
			setMessage("");
		} catch (error) {
			setMessage(error.response?.data?.message || "Unable to load booking requests.");
		}
	}

	useEffect(() => {
		loadRequests();
	}, []);

	async function reviewRequest(bookingId, status) {
		try {
			setActionError("");
			await updateBookingStatus(bookingId, status);
			if (status === "APPROVED") {
				alert("Borrow request accepted! Any other pending requests for this item have been automatically rejected.");
			}
			await loadRequests();
		} catch (error) {
			setActionError(error.response?.data?.message || "Unable to update this request.");
		}
	}

	async function handleConfirmReturn(bookingId, relist) {
		try {
			setActionError("");
			setConfirmingBookingId(bookingId);
			await completeReturn(bookingId, relist);
			alert(
				relist
					? "Return confirmed! The item has been marked as returned and relisted into your active catalog."
					: "Return confirmed! The item has been marked as returned and kept unlisted."
			);
			await loadRequests();
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
				damageCost: Number(damageCost),
				status: "REPORTED"
			});
			setDamageModalBooking(null);
			setDamageDesc("");
			setDamageCost("");
			alert("Damage report filed.");
		} catch (error) {
			console.error(error);
			alert("Error filing damage report.");
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
			alert("Review submitted!");
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
				label: `${avg} / 5.0 (${reviews.length} ${reviews.length === 1 ? 'review' : 'reviews'})`,
				badgeClass: avg >= 4 ? "rating-high" : avg >= 3 ? "rating-med" : "rating-low",
				recommendation: avg >= 4 ? "Highly Rated Borrower" : avg >= 3 ? "Moderate Rating - Check Reviews" : "Low Rating - Caution Advised",
			};
		}

		if (borrower?.rating && Number(borrower.rating) > 0) {
			const score = Number(borrower.rating).toFixed(1);
			return {
				avg: score,
				count: 1,
				label: `${score} / 5.0`,
				badgeClass: score >= 4 ? "rating-high" : "rating-med",
				recommendation: score >= 4 ? "Trusted Borrower" : "Check borrower profile",
			};
		}

		return {
			avg: null,
			count: 0,
			label: "New Borrower (No ratings yet)",
			badgeClass: "rating-new",
			recommendation: "First-time borrower on ShareSpare",
		};
	}

	return (
		<div className="workflow-page">
			<Navbar />
			<main className="workflow-content">
				<div className="workflow-heading">
					<div>
						<p className="workflow-kicker">Lender view</p>
						<h1>Rental requests</h1>
						<p>Review borrower ratings and feedback before approving requests.</p>
					</div>
					<Link to="/my-listings" className="workflow-button secondary">My listings</Link>
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

						return (
							<article className="workflow-card lender-request-card" key={request.bookingId}>
								<div className="request-main-info">
									<div className="request-header-row">
										<span className="workflow-label">Booking #{request.bookingId}</span>
										<strong className={`status status-${request.status.toLowerCase()}`}>
											{request.status}
										</strong>
									</div>

									<h2>{request.item?.itemName || `Item #${request.itemId}`}</h2>
									<p className="item-meta-info">
										<span>{request.item?.location || "Location not specified"}</span>
										<span>₹{request.price || request.item?.rentalPrice || "-"} / hr</span>
									</p>

									<div className="borrower-rating-card">
										<div className="borrower-card-header">
											<div>
												<span className="borrower-title">Borrower</span>
												<h3 className="borrower-name">
													{request.borrower?.name || "Verified User"}
												</h3>
												{request.borrower?.location && (
													<span className="borrower-location">{request.borrower.location}</span>
												)}
											</div>
											<div className={`rating-badge ${ratingInfo.badgeClass}`}>
												{ratingInfo.label}
											</div>
										</div>

										<div className="rating-recommendation">
											{ratingInfo.recommendation}
										</div>

										{/* Customer Rental History Stats */}
										<div className="customer-rental-history-badge">
											{request.customerHistory?.timesWithLender > 0 ? (
												<span className="repeat-badge">
													🔁 Rented from you <strong>{request.customerHistory.timesWithLender}</strong> previous {request.customerHistory.timesWithLender === 1 ? "time" : "times"}
												</span>
											) : (
												<span className="first-time-badge">
													🌱 First-time renting from you
												</span>
											)}
											{request.customerHistory?.totalRentals > 0 && (
												<span className="total-badge">
													• {request.customerHistory.totalRentals} platform {request.customerHistory.totalRentals === 1 ? "rental" : "rentals"} overall
												</span>
											)}
										</div>

										{request.reviews && request.reviews.length > 0 && (
											<div className="borrower-reviews-wrapper">
												<button
													type="button"
													className="toggle-reviews-btn"
													onClick={() => toggleReviews(request.bookingId)}
												>
													{isReviewsOpen
														? "Hide Borrower Reviews"
														: `View ${request.reviews.length} Previous Review${request.reviews.length > 1 ? 's' : ''}`}
												</button>

												{isReviewsOpen && (
													<div className="reviews-dropdown-list">
														{request.reviews.map((rev) => (
															<div className="review-item-card" key={rev.reviewId}>
																<div className="review-item-top">
																	<span className="review-stars">{Number(rev.rating).toFixed(1)} / 5</span>
																	<small className="review-date">
																		{rev.createdAt ? new Date(rev.createdAt).toLocaleDateString() : ""}
																	</small>
																</div>
																{rev.comment && <p className="review-comment">"{rev.comment}"</p>}
															</div>
														))}
													</div>
												)}
											</div>
										)}
									</div>

									<dl className="booking-details">
										<div><dt>From</dt><dd>{new Date(request.startTime).toLocaleString()}</dd></div>
										<div><dt>Until</dt><dd>{new Date(request.endTime).toLocaleString()}</dd></div>
									</dl>
								</div>

								<div className="workflow-actions-box">
									{request.status === "REQUESTED" ? (
										<div className="workflow-actions">
											<button
												className="workflow-button approve-btn"
												onClick={() => reviewRequest(request.bookingId, "APPROVED")}
											>
												Approve Request
											</button>
											<button
												className="workflow-button danger reject-btn"
												onClick={() => reviewRequest(request.bookingId, "REJECTED")}
											>
												Reject Request
											</button>
										</div>
									) : (
										<div className="reviewed-tag">
											Decision Recorded: <strong>{request.status}</strong>
										</div>
									)}

									{/* Return Verification Questionnaire for Lender */}
									{request.status === "RETURNED" && (
										<div className="lender-return-verification">
											<div className="verification-header">
												<h4>🔄 Return Verification</h4>
												<span className="badge-pill">Action Required</span>
											</div>

											<div className="question-block">
												<p className="question-title">1. Did the product return?</p>
												<div className="question-options">
													<label className={`choice-pill ${returnAnswers[request.bookingId]?.returned !== false ? 'selected' : ''}`}>
														<input
															type="radio"
															name={`returned-${request.bookingId}`}
															checked={returnAnswers[request.bookingId]?.returned !== false}
															onChange={() => setReturnAnswer(request.bookingId, 'returned', true)}
														/>
														✅ Yes, product has returned
													</label>
													<label className={`choice-pill ${returnAnswers[request.bookingId]?.returned === false ? 'selected' : ''}`}>
														<input
															type="radio"
															name={`returned-${request.bookingId}`}
															checked={returnAnswers[request.bookingId]?.returned === false}
															onChange={() => setReturnAnswer(request.bookingId, 'returned', false)}
														/>
														❌ Not returned / Issue
													</label>
												</div>
											</div>

											{returnAnswers[request.bookingId]?.returned !== false && (
												<div className="question-block">
													<p className="question-title">2. Are you willing to list it out again?</p>
													<div className="question-options">
														<label className={`choice-pill ${returnAnswers[request.bookingId]?.relist !== false ? 'selected' : ''}`}>
															<input
																type="radio"
																name={`relist-${request.bookingId}`}
																checked={returnAnswers[request.bookingId]?.relist !== false}
																onChange={() => setReturnAnswer(request.bookingId, 'relist', true)}
															/>
															📦 Yes, relist as available
														</label>
														<label className={`choice-pill ${returnAnswers[request.bookingId]?.relist === false ? 'selected' : ''}`}>
															<input
																type="radio"
																name={`relist-${request.bookingId}`}
																checked={returnAnswers[request.bookingId]?.relist === false}
																onChange={() => setReturnAnswer(request.bookingId, 'relist', false)}
															/>
															⏸️ No, keep unlisted for now
														</label>
													</div>
												</div>
											)}

											<div className="verification-actions">
												{returnAnswers[request.bookingId]?.returned !== false ? (
													<button
														className="workflow-button"
														disabled={confirmingBookingId === request.bookingId}
														onClick={() => handleConfirmReturn(request.bookingId, returnAnswers[request.bookingId]?.relist !== false)}
													>
														{confirmingBookingId === request.bookingId ? "Confirming..." : "Confirm Return & Complete"}
													</button>
												) : (
													<button
														className="workflow-button danger"
														onClick={() => setDamageModalBooking(request)}
													>
														Report Damage / Missing Item
													</button>
												)}
											</div>

											<div className="workflow-actions" style={{marginTop: '12px', borderTop: '1px dashed #d0e2f5', paddingTop: '10px'}}>
												<button
													className="workflow-button danger"
													onClick={() => setDamageModalBooking(request)}
													style={{fontSize: '12px', padding: '6px 10px'}}
												>
													Report Damage
												</button>
												<button
													className="workflow-button"
													onClick={() => setReviewModalBooking(request)}
													style={{fontSize: '12px', padding: '6px 10px'}}
												>
													Review Borrower
												</button>
											</div>
										</div>
									)}

									{request.status === "COMPLETED" && (
										<div style={{marginTop: '10px'}}>
											<div className="reviewed-tag" style={{background: '#e8f7ec', color: '#1b5e20', border: '1px solid #b7e4c7', padding: '6px 10px', borderRadius: '8px', fontSize: '13px', marginBottom: '8px'}}>
												✅ Return Verified & Rental Completed
											</div>
											<div className="workflow-actions">
												<button
													className="workflow-button"
													onClick={() => setReviewModalBooking(request)}
													style={{fontSize: '12px', padding: '6px 10px'}}
												>
													Review Borrower
												</button>
												<button
													className="workflow-button danger"
													onClick={() => setDamageModalBooking(request)}
													style={{fontSize: '12px', padding: '6px 10px'}}
												>
													Report Damage
												</button>
											</div>
										</div>
									)}
								</div>
							</article>
						);
					})}
				</div>

				{/* Modals */}
				{damageModalBooking && (
					<div className="modal-overlay">
						<div className="modal-card">
							<h2>Report Damage</h2>
							<p>For <strong>Item #{damageModalBooking.itemId}</strong> from booking #{damageModalBooking.bookingId}</p>
							<div className="form-group">
								<label>Damage Description</label>
								<textarea
									value={damageDesc}
									onChange={(e) => setDamageDesc(e.target.value)}
									placeholder="Describe the damage..."
									style={{width: '100%', minHeight: '80px'}}
								/>
							</div>
							<div className="form-group" style={{marginTop: '10px'}}>
								<label>Estimated Cost (₹)</label>
								<input
									type="number"
									value={damageCost}
									onChange={(e) => setDamageCost(e.target.value)}
									style={{width: '100%', padding: '8px'}}
								/>
							</div>
							<div style={{display: 'flex', gap: '10px', marginTop: '15px'}}>
								<button className="workflow-button danger" onClick={handleDamageReport}>File Report</button>
								<button className="workflow-button secondary" onClick={() => setDamageModalBooking(null)}>Cancel</button>
							</div>
						</div>
					</div>
				)}

				{reviewModalBooking && (
					<div className="modal-overlay">
						<div className="modal-card">
							<h2>Review Borrower</h2>
							<div className="form-group">
								<label>Rating (1-5)</label>
								<input
									type="number"
									min="1"
									max="5"
									value={reviewRating}
									onChange={(e) => setReviewRating(e.target.value)}
									style={{width: '100%', padding: '8px'}}
								/>
							</div>
							<div className="form-group" style={{marginTop: '10px'}}>
								<label>Comment</label>
								<textarea
									value={reviewComment}
									onChange={(e) => setReviewComment(e.target.value)}
									placeholder="Great borrower!"
									style={{width: '100%', minHeight: '80px'}}
								/>
							</div>
							<div style={{display: 'flex', gap: '10px', marginTop: '15px'}}>
								<button className="workflow-button" onClick={handleReview}>Submit Review</button>
								<button className="workflow-button danger" onClick={() => setReviewModalBooking(null)}>Cancel</button>
							</div>
						</div>
					</div>
				)}

			</main>
		</div>
	);
}

export default RentalRequestsPage;
