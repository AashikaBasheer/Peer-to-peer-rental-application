import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getBookingsByRenter } from "../services/api";
import { supabase } from "../lib/supabase";
import "./WorkflowPage.css";

function MyRentalsPage() {
	const navigate = useNavigate();
	const [bookings, setBookings] = useState([]);
	const [message, setMessage] = useState("Loading your requests...");

	useEffect(() => {
		async function loadBookings() {
			const { data } = await supabase.auth.getSession();
			const renterId = data.session?.user?.id;

			if (!renterId) {
				setMessage("Please log in to see your rental requests.");
				return;
			}

			try {
				setBookings(await getBookingsByRenter(renterId));
				setMessage("");
			} catch {
				setMessage("Unable to load your rental requests.");
			}
		}

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
								<h2>Item #{booking.itemId}</h2>
								<p>{booking.startTime} to {booking.endTime}</p>
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
											},
										})}
									>
										Pay now
									</button>
								)}
							</div>
						</article>
					))}
				</div>
			</main>
		</div>
	);
}

export default MyRentalsPage;
