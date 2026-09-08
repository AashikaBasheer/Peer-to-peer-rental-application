import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getMyRentals, createReturn, createReview } from "../services/api";
import { supabase } from "../lib/supabase";
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
			const fetched = await getMyRentals(renterId);
			fetched.sort((a, b) => {
				const dateA = new Date(a.createdAt || 0).getTime();
				const dateB = new Date(b.createdAt || 0).getTime();
				if (dateA !== dateB) {
					return dateB - dateA;
				}
				return (b.bookingId || 0) - (a.bookingId || 0);
			});
			setBookings(fetched);
			setMessage("");
		} catch (error) {
			setMessage("Unable to load your rental requests.");
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
						<p className="workflow-kicker">Borrower view</p>
						<h1>My rental requests</h1>
						<p>Track approval and pay after the lender accepts.</p>
					</div>
					<Link to="/products" className="workflow-button secondary">Browse items</Link>
				</div>

				{message && <p className="workflow-message">{message}</p>}
				<div className="workflow-list">
					{bookings.map((booking) => (
						<article className="workflow-card" key={booking.bookingId}>
							<div>
								<span className="workflow-label">Booking #{booking.bookingId}</span>
								<h2>{booking.item?.itemName || `Item #${booking.itemId}`}</h2>
								<p>{booking.item?.location || "Location unavailable"}</p>
								<dl className="booking-details">
									<div><dt>From</dt><dd>{new Date(booking.startTime).toLocaleString()}</dd></div>
									<div><dt>Until</dt><dd>{new Date(booking.endTime).toLocaleString()}</dd></div>
									<div><dt>Rental</dt><dd>{booking.price ?? booking.item?.rentalPrice ?? "-"}</dd></div>
									<div><dt>Deposit</dt><dd>{booking.securityDeposit ?? booking.item?.securityDeposit ?? "-"}</dd></div>
								</dl>
							</div>
							<div className="workflow-actions">
								<strong className={`status status-${booking.status.toLowerCase()}`}>
									{booking.status}
								</strong>
								{booking.status === "APPROVED" && (
									<button
										className="workflow-button"
										onClick={() => navigate("/payment", {
											state: {
												bookingId: booking.bookingId,
												productId: booking.itemId,
												productName: `Item #${booking.itemId}`,
												rentAmount: booking.price,
												rentalHours: 1,
												lenderName: "Your lender",
												deliveryMethod: booking.deliveryMethod,
												deliveryPartner: booking.deliveryPartner,
											},
										})}
									>
										Pay now
									</button>
								)}
								{booking.status === "CONFIRMED" && (
									<button
										className="workflow-button"
										onClick={() => setReturnModalBooking(booking)}
									>
										Return Item
									</button>
								)}
								{booking.status === "RETURNED" && (
									<button
										className="workflow-button"
										onClick={() => setReviewModalBooking(booking)}
									>
										Leave Review
									</button>
								)}
							</div>
						</article>
					))}
				</div>

				{/* Modals */}
				{returnModalBooking && (
					<div className="modal-overlay">
						<div className="modal-card">
							<h2>Return Item</h2>
							<p>Are you returning <strong>Item #{returnModalBooking.itemId}</strong>?</p>
							<div className="form-group">
								<label>Remarks / Condition Notes</label>
								<textarea
									value={returnRemarks}
									onChange={(e) => setReturnRemarks(e.target.value)}
									placeholder="Item looks good..."
									style={{width: '100%', minHeight: '80px'}}
								/>
							</div>
							<div style={{display: 'flex', gap: '10px', marginTop: '15px'}}>
								<button className="workflow-button" onClick={handleReturn}>Confirm Return</button>
								<button className="workflow-button danger" onClick={() => setReturnModalBooking(null)}>Cancel</button>
							</div>
						</div>
					</div>
				)}

				{reviewModalBooking && (
					<div className="modal-overlay">
						<div className="modal-card">
							<h2>Review Lender</h2>
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
									placeholder="Great lender!"
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

export default MyRentalsPage;
