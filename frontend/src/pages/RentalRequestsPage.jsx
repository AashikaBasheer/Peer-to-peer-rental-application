import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getBookingsByLender, updateBookingStatus } from "../services/api";
import { supabase } from "../lib/supabase";
import "./WorkflowPage.css";

function RentalRequestsPage() {
	const [requests, setRequests] = useState([]);
	const [message, setMessage] = useState("Loading booking requests...");
	const [actionError, setActionError] = useState("");

	async function loadRequests() {
		const { data } = await supabase.auth.getSession();
		const lenderId = data.session?.user?.id;

		if (!lenderId) {
			setMessage("Please log in to see requests for your items.");
			return;
		}

		try {
			const lenderRequests = await getBookingsByLender(lenderId);
			setRequests(lenderRequests);
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
			await loadRequests();
		} catch (error) {
			setActionError(error.response?.data?.message || "Unable to update this request.");
		}
	}

	return (
		<div className="workflow-page">
			<Navbar />
			<main className="workflow-content">
				<div className="workflow-heading">
					<div>
						<p className="workflow-kicker">Lender view</p>
						<h1>Rental requests</h1>
						<p>Approve requests before borrowers can pay.</p>
					</div>
					<Link to="/my-listings" className="workflow-button secondary">My listings</Link>
				</div>

				{message && <p className="workflow-message">{message}</p>}
				{actionError && <p className="workflow-message workflow-error">{actionError}</p>}
				{!message && requests.length === 0 && (
					<p className="workflow-message">No rental requests found for your listings.</p>
				)}
				<div className="workflow-list">
					{requests.map((request) => (
						<article className="workflow-card" key={request.bookingId}>
							<div>
								<span className="workflow-label">Booking #{request.bookingId}</span>
								<h2>Item #{request.itemId}</h2>
								<p>Borrower: {request.renterId}</p>
								<p>{request.startTime} to {request.endTime}</p>
							</div>
							{request.status === "REQUESTED" ? (
								<div className="workflow-actions">
									<button className="workflow-button" onClick={() => reviewRequest(request.bookingId, "APPROVED")}>Approve</button>
									<button className="workflow-button danger" onClick={() => reviewRequest(request.bookingId, "REJECTED")}>Reject</button>
								</div>
							) : (
								<strong className={`status status-${request.status.toLowerCase()}`}>{request.status}</strong>
							)}
						</article>
					))}
				</div>
			</main>
		</div>
	);
}

export default RentalRequestsPage;
