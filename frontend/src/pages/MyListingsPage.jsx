import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getMyItems } from "../services/api";
import { supabase } from "../lib/supabase";
import "./WorkflowPage.css";

function MyListingsPage() {
	const [items, setItems] = useState([]);

	useEffect(() => {
		async function loadItems() {
			const { data } = await supabase.auth.getSession();
			const ownerId = data.session?.user?.id;
			if (ownerId) setItems(await getMyItems(ownerId));
		}

		loadItems();
	}, []);

	return (
		<div className="workflow-page">
			<Navbar />
			<main className="workflow-content">
				<div className="workflow-heading">
					<div>
						<p className="workflow-kicker">Lender view</p>
						<h1>My listings</h1>
						<p>Keep track of the items you are sharing.</p>
					</div>
					<Link to="/add-product" className="workflow-button">List an item</Link>
				</div>
				<div className="workflow-list">
					{items.map((item) => (
						<article className="workflow-card" key={item.itemId}>
							<div>
								<span className="workflow-label">{item.location || "Local listing"}</span>
								<h2>{item.itemName}</h2>
								<p>{item.description}</p>
							</div>
							<strong className="status">{item.availability ? "AVAILABLE" : "UNAVAILABLE"}</strong>
						</article>
					))}
				</div>
			</main>
		</div>
	);
}

export default MyListingsPage;
