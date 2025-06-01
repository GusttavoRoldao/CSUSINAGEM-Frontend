import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import MainContent from "../components/MainContent";
import './Dashboard.css';
import CategoryPage from "./CategoryPage";

export default function Dashboard() {
    const [showAddItemForm, setShowAddItemForm] = useState(false);

    return (
        <div className="dashboard-layout">
            <Sidebar
                onCategoryAdded={() => { }}
                onPinToggle={() => { }}
                onHoverChange={() => { }}
                onOpenModal={() => { }}
            />

            <div className="main-content-container">
                {showAddItemForm ? (
                    <CategoryPage />
                ) : (
                    <MainContent />
                )}
            </div>
        </div>
    );
}