import "./footer.css";

const Footer = () => {
    return (
        <>
            {/* BACK TO TOP */}
            <div className="back-to-top" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
                Back to top
            </div>

            {/* MAIN FOOTER */}
            <footer className="footer">
                <div className="footer-top">
                    <div>
                        <h6>Get to Know Us</h6>
                        <a href="#">About Us</a>
                        <a href="#">Careers</a>
                        <a href="#">Press Releases</a>
                        <a href="#">Amazon Science</a>
                    </div>

                    <div>
                        <h6>Connect with Us</h6>
                        <a href="https://www.facebook.com/profile.php?id=100044477266809">Facebook</a>
                        <a href="https://x.com/ShivamKuma4374">Twitter</a>
                        <a href="https://www.instagram.com/_shivam_prajapati____/">Instagram</a>
                    </div>

                    <div>
                        <h6>Make Money with Us</h6>
                        <a href="#">Sell on Amazon</a>
                        <a href="#">Affiliate Program</a>
                        <a href="#">Advertise Your Products</a>
                        <a href="#">Become a Seller</a>
                    </div>

                    <div>
                        <h6>Let Us Help You</h6>
                        <a href="#">Your Account</a>
                        <a href="#">Returns Centre</a>
                        <a href="#">100% Purchase Protection</a>
                        <a href="#">Help</a>
                    </div>
                </div>

                {/* BOTTOM */}
                <div className="footer-bottom">
                    <p>© 2026 Amazon Clone. All rights reserved.</p>
                </div>
            </footer>
        </>
    );
};

export default Footer;