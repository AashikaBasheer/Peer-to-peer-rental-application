import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { createProduct } from "../services/api";
import { supabase } from "../lib/supabase";
import "./WorkflowPage.css";

function AddProductPage() {
	const navigate = useNavigate();
	const [form, setForm] = useState({
		itemName: "",
		description: "",
		catID: 1,
		location: "",
		condition: "Good",
		rentalPrice: "",
		securityDeposit: "",
	});
	const [error, setError] = useState("");

	function updateField(event) {
		setForm({ ...form, [event.target.name]: event.target.value });
	}

	async function handleSubmit(event) {
		event.preventDefault();
		setError("");

		try {
			const { data } = await supabase.auth.getSession();
			const ownerId = data.session?.user?.id;
			if (!ownerId) throw new Error("Please log in before listing an item.");

			await createProduct({
				...form,
				ownerId,
				availability: true,
				catID: Number(form.catID),
				rentalPrice: Number(form.rentalPrice),
				securityDeposit: Number(form.securityDeposit || 0),
			});
			navigate("/my-listings");
		} catch (submitError) {
			setError(submitError.response?.data?.message || submitError.message);
		}
	}

	return (
		<div className="workflow-page">
			<Navbar />
			<main className="workflow-content">
				<div className="workflow-heading">
					<div>
						<p className="workflow-kicker">Lender view</p>
						<h1>List an item</h1>
						<p>Share something useful with people nearby.</p>
					</div>
					<Link to="/my-listings" className="workflow-button secondary">Cancel</Link>
				</div>

				<form className="workflow-card listing-form" onSubmit={handleSubmit}>
					<label>Item name<input name="itemName" value={form.itemName} onChange={updateField} required /></label>
					<label>Description<textarea name="description" value={form.description} onChange={updateField} required /></label>
					<label>Category<select name="catID" value={form.catID} onChange={updateField}>
						<option value="1">Electronics</option>
						<option value="2">Tools & Equipment</option>
						<option value="3">Furniture & Home</option>
						<option value="4">Outdoor & Events</option>
					</select></label>
					<label>Location<input name="location" value={form.location} onChange={updateField} required /></label>
					<label>Condition<input name="condition" value={form.condition} onChange={updateField} required /></label>
					<label>Rent per hour<input name="rentalPrice" type="number" min="0" value={form.rentalPrice} onChange={updateField} required /></label>
					<label>Security deposit<input name="securityDeposit" type="number" min="0" value={form.securityDeposit} onChange={updateField} /></label>
					{error && <p className="workflow-message">{error}</p>}
					<button className="workflow-button" type="submit">Publish listing</button>
				</form>
			</main>
		</div>
	);
}

export default AddProductPage;
