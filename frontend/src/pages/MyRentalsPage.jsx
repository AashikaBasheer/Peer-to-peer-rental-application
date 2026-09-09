import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getBookingsByRenter, createReturn, createReview, getProductById } from "../services/api";
import { supabase } from "../lib/supabase";
import {
	IconStar,
	IconCheck,
	IconX,
	IconCalendar,
	IconClock,
	IconMapPin,
	IconPackage,
} from "../components/Icons";
import "./WorkflowPage.css";

function MyRentalsPage() {
	const navigate = useNavigate();
	const [bookings, setBookings] = useState([]);
	const [returnModalBooking, setReturnModalBooking] = useState(null);
	const [reviewModalBooking, setReviewModalBooking] = useState(null);
	const [returnRemarks, setReturnRemarks] = useState("");
	const [reviewRating, setReviewRating] = useState(5);
	const [reviewComment, setReviewComment] = useState("");
	const [message, setMessage] = useState("Loading your requests...");

	const loadBookings = async () => {
		const { data } = await supabase.auth.getSession();
		const renterId = data.session?.user?.id;
		if (!renterId) {
			setMessage("Please log in to see your rental requests.");
			return;
		}
		try {
			const fetched = await getBookingsByRenter(renterId);
			if (!fetched || fetched.length === 0) {
				setBookings([]);
				setMessage("No rental requests found.");
				return;
			}

			// Enrich bookings with item details so product name, price, and location are visible
			const enriched = await Promise.all(
				fetched.map(async (booking) => {
					let item = null;
					try {
						item = await getProductById(booking.itemId);
					} catch (e) {
						// item may have been removed or unavailable
					}
					return {
						...booking,
						item,
					};
				})
			);

			enriched.sort((a, b) => {
				const dateA = new Date(a.createdAt || 0).getTime();
				const dateB = new Date(b.createdAt || 0).getTime();
				if (dateA !== dateB) {
					return dateB - dateA;
				}
				return (b.bookingId || 0) - (a.bookingId || 0);
			});

			setBookings(enriched);
			setMessage("");
		} catch (error) {
			console.error("Failed to load rentals:", error);
			setMessage("Unable to load your rental requests.");
		}
	};

	const handleReturn = async () => {
		if (!returnModalBooking) return;
		try {
			await createReturn({
				bookingId: returnModalBooking.bookingId,
				remarks: returnRemarks || "Item returned in good condition",
				condition: "Good",
				status: "RETURNED",
			});
			setReturnModalBooking(null);
			setReturnRemarks("");
			alert("Return submitted successfully! The lender has been notified to verify receipt.");
			await loadBookings();
		} catch (error) {
			console.error("Error returning item:", error);
			alert("Error submitting return. Please try again.");
		}
	};

	const handleReview = async () => {
		if (!reviewModalBooking) return;
		try {
			const { data } = await supabase.auth.getSession();
			const reviewerId = data.session?.user?.id;
			await createReview({
				bookingId: reviewModalBooking.bookingId,
				reviewerId,
				revieweeId: reviewModalBooking.lenderId,
				rating: Number(reviewRating),
				comment: reviewComment,
			});
			setReviewModalBooking(null);
			setReviewRating(5);
			setReviewComment("");
			alert("Review submitted successfully!");
			await loadBookings();
		} catch (error) {
			console.error("Error submitting review:", error);
			alert("Error submitting review. Please try again.");
		}
	};

	useEffect(() => {
		loadBookings();
	}, []);

	return (
		<div className="workflow-page">
			<Navbar />
			<main className="workflow-content">
				<div className="workflow-heading">
					<div>
						<p className="workflow-kicker">Borrower Dashboard</p>
						<h1>My Rental Requests</h1>
						<p>Track request approvals, return items, and review your lenders effortlessly.</p>
					</div>
					<Link to="/products" className="workflow-button secondary">
						Browse Items
					</Link>
				</div>

				{message && <p className="workflow-message">{message}</p>}

				<div className="workflow-list">
					{bookings.map((booking) => (
						<article className="workflow-card" key={booking.bookingId}>
							{/* Top Bar */}
							<div className="card-header-row">
								<div className="card-header-left">
									<span className="workflow-label">Booking #{booking.bookingId}</span>
									{booking.createdAt && (
										<span className="booking-timestamp">
											Placed on {new Date(booking.createdAt).toLocaleDateString()}
										</span>
									)}
								</div>
								<strong className={`status status-${booking.status.toLowerCase()}`}>
									{booking.status}
								</strong>
							</div>

							{/* Main Content */}
							<div className="card-main-content">
								<div className="item-title-row">
									<h2 className="item-title">
										{booking.item?.itemName || `Item #${booking.itemId}`}
									</h2>
								</div>

								<div className="item-meta-bar">
									<span className="meta-item">
										<IconMapPin size={14} />
										{booking.item?.location || "Location not specified"}
									</span>
									<span className="meta-item meta-price">
										Rent: ₹{booking.price ?? booking.item?.rentalPrice ?? "-"}
									</span>
									{(booking.securityDeposit != null || booking.item?.securityDeposit != null) && (
										<span className="meta-item">
											Deposit: ₹{booking.securityDeposit ?? booking.item?.securityDeposit}
										</span>
									)}
								</div>

								{/* Schedule Grid */}
								<div className="schedule-grid">
									<div className="schedule-block">
										<span className="schedule-label">
											<IconCalendar size={12} />
											Rental Start
										</span>
										<span className="schedule-value">
											{new Date(booking.startTime).toLocaleString([], {
												dateStyle: "medium",
												timeStyle: "short",
											})}
										</span>
									</div>
									<div className="schedule-block">
										<span className="schedule-label">
											<IconClock size={12} />
											Rental End
										</span>
										<span className="schedule-value">
											{new Date(booking.endTime).toLocaleString([], {
												dateStyle: "medium",
												timeStyle: "short",
											})}
										</span>
									</div>
								</div>
							</div>

							{/* Card Actions Bar */}
							<div className="card-actions-bar">
								{/* Review Lender Button always accessible if booking confirmed, returned or completed */}
								{["CONFIRMED", "BOOKED", "RETURNED", "COMPLETED"].includes(booking.status) && (
									<button
										className="workflow-button star-btn"
										onClick={() => setReviewModalBooking(booking)}
										title="Leave a review for this lender"
									>
										<IconStar size={14} />
										Review Lender
									</button>
								)}

								{booking.status === "APPROVED" && (
									<button
										className="workflow-button success"
										onClick={() =>
											navigate("/payment", {
												state: {
													bookingId: booking.bookingId,
													productId: booking.itemId,
													productName: booking.item?.itemName || `Item #${booking.itemId}`,
													rentAmount: booking.price,
													rentalHours: 1,
													lenderName: "Your Lender",
													deliveryMethod: booking.deliveryMethod,
													deliveryPartner: booking.deliveryPartner,
												},
											})
										}
									>
										<IconCheck size={14} />
										Pay Now (₹{booking.price})
									</button>
								)}

								{["CONFIRMED", "BOOKED"].includes(booking.status) && (
									<button
										className="workflow-button"
										onClick={() => setReturnModalBooking(booking)}
									>
										<IconPackage size={14} />
										Return Item
									</button>
								)}

								{booking.status === "RETURNED" && (
									<span className="status status-returned">
										Return Submitted — Awaiting Lender Receipt
									</span>
								)}

								{booking.status === "COMPLETED" && (
									<span className="status status-completed">
										<IconCheck size={12} />
										Rental Completed
									</span>
								)}
							</div>
						</article>
					))}
				</div>

				{/* Return Modal */}
				{returnModalBooking && (
					<div
						className="modal-overlay"
						onClick={(e) => {
							if (e.target === e.currentTarget) setReturnModalBooking(null);
						}}
					>
						<div className="modal-card">
							<button
								className="modal-close-btn"
								onClick={() => setReturnModalBooking(null)}
								title="Close dialog"
							>
								<IconX size={16} />
							</button>
							<h2>Confirm Item Return</h2>
							<p>
								Are you ready to mark <strong>{returnModalBooking.item?.itemName || `Item #${returnModalBooking.itemId}`}</strong> as returned?
							</p>
							<div className="form-group">
								<label>Condition Notes / Return Remarks</label>
								<textarea
									value={returnRemarks}
									onChange={(e) => setReturnRemarks(e.target.value)}
									placeholder="Describe product condition upon return (e.g., Clean and working perfectly)..."
									rows={3}
								/>
							</div>
							<div className="modal-actions">
								<button className="workflow-button secondary" onClick={() => setReturnModalBooking(null)}>
									Cancel
								</button>
								<button className="workflow-button" onClick={handleReturn}>
									Submit Return
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
							<h2>Review Lender</h2>
							<p>
								Share your rental experience for booking #{reviewModalBooking.bookingId}.
							</p>
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
								<label>Review & Feedback</label>
								<textarea
									value={reviewComment}
									onChange={(e) => setReviewComment(e.target.value)}
									placeholder="Quick handoff, helpful lender, product matched description!"
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

export default MyRentalsPage;
