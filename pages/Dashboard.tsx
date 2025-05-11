import React from "react";
import Header from "../src/component/common/Header";
import BookTable from "../src/component/dashbaord/BookTable";
import Footer from "../src/component/common/Footer";

function Dashboard() {
  return (
    <div className="bg-blue-100">
      <Header user={undefined} onLogout={undefined} />
      <BookTable />
      <Footer />
    </div>
  );
}

export default Dashboard;
