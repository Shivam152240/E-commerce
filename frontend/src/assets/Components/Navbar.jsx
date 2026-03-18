import React from "react"
import './navbar.css'
import Home from "../pages/Home.jsx"


function Navbar({search, setSearch, isHomePage}) {
  const [searchText, setSearchText] = React.useState("");
    const handleSearch = (e) => {
    e.preventDefault(); // 🚫 page reload stop
    setSearch(searchText); // ✅ search apply
  };
    return (
        <>
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
  <div className="container-fluid">
    <button className="btn me-2 text-white" type="button"
        data-bs-toggle="offcanvas"
        data-bs-target="#offcanvasDark">
        ☰
    </button>
    <a className="navbar-brand" href="/home">QuickCart</a>

    {/* Search bar for mobile visibility (hidden on desktop) */}
    <form className="d-flex search flex-grow-1 mx-2 d-lg-none" onSubmit={handleSearch} role="search">
      <input 
        className="form-control" 
        type="search" 
        value={searchText} 
        onChange={(e) => setSearchText(e.target.value)} 
        placeholder="Search..." 
        aria-label="Search"
      />
    </form>

    <div className="collapse navbar-collapse" id="navbarScroll">
      <ul className="navbar-nav me-auto my-2 my-lg-0 navbar-nav-scroll" style={{ '--bs-scroll-height': '100px' }}>
      </ul>
      
      {/* Search bar for desktop visibility (hidden on mobile) */}
      <form className="d-none d-lg-flex search mx-lg-4 ms-auto" onSubmit={handleSearch} role="search">
        <input 
          className="form-control" 
          type="search" 
          value={searchText} 
          onChange={(e) => setSearchText(e.target.value)} 
          placeholder="Search products..." 
          aria-label="Search"
        />
        <button className="btn btn-outline-white ms-2" type="submit">Search</button>
      </form>

      {/* Navigation icons visible only on desktop */}
      <div className="d-none d-lg-flex text-white icon align-items-center">
        <i className="fa-solid fa-cart-shopping"></i>
        <a className="text-white ms-2 cart" href="/Cart">Cart</a>
      </div>
    </div>
  </div>
</nav>

        </>
    )
}
export default Navbar