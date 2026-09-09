import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getMyItems } from "../services/api";
import { supabase } from "../lib/supabase";
import { IconMapPin } from "../components/Icons";
import "./WorkflowPage.css";

function MyListingsPage() {
	const [items, setItems] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function loadItems() {
			try {
				const { data } = await supabase.auth.getSession();
				const ownerId = data.session?.user?.id;
				if (ownerId) {
					const list = await getMyItems(ownerId);
					setItems(list || []);
				}
			} catch (e) {
				console.error("Failed to load listings:", e);
			} finally {
				setLoading(false);
			}
		}

		loadItems();
	}, []);

	return (
		<div className="workflow-page">
			<Navbar />
			<main className="workflow-content">
				<div className="workflow-heading">
					<div>
						<p className="workflow-kicker">Lender View</p>
						<h1>My Listings</h1>
						<p>Keep track of the items you are sharing and their active availability.</p>
					</div>
					<Link to="/add-product" className="workflow-button">
						List an Item
					</Link>
				</div>

				{loading && <p className="workflow-message">Loading your listings...</p>}
				{!loading && items.length === 0 && (
					<p className="workflow-message">You haven't listed any items yet. Start sharing today!</p>
				)}

				<div className="workflow-list">
					{items.map((item) => (
						<article className="workflow-card" key={item.itemId}>
							<div className="card-header-row">
								<div className="card-header-left">
									<span className="workflow-label">Item #{item.itemId}</span>
								</div>
								<strong
									className={`status ${
										item.availability ? "status-confirmed" : "status-rejected"
									}`}
								>
									{item.availability ? "Available" : "Unavailable"}
								</strong>
							</div>

							<div className="card-main-content">
								<div className="item-title-row">
									<h2 className="item-title">{item.itemName}</h2>
								</div>

								<div className="item-meta-bar">
									<span className="meta-item">
										<IconMapPin size={14} />
										{item.location || "Location not specified"}
									</span>
									<span className="meta-item meta-price">₹{item.rentalPrice} / hr</span>
									{item.securityDeposit != null && (
										<span className="meta-item">Deposit: ₹{item.securityDeposit}</span>
									)}
								</div>

								{item.description && (
									<p style={{ margin: "4px 0 0", color: "#526b84", fontSize: "14px", lineHeight: "1.5" }}>
										{item.description}
									</p>
								)}
							</div>
						</article>
					))}
				</div>
			</main>
		</div>
	);
}

export default MyListingsPage;
