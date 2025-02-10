export default function About() {
  return (
    <div className="bg-gray-50 py-16 sm:px-6 lg:px-8 min-h-screen">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
          About Mountain Tech
        </h2>
        <p className="text-lg text-gray-600 mb-12 max-w-3xl mx-auto">
          At Mountain Tech, we offer innovative solutions for membership
          management, project financing, and growth acceleration. Our platform
          is designed to empower organizations to thrive in the digital age.
        </p>
      </div>

      {/* Content Boxes - 6 Options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-12 max-w-7xl mx-auto px-4">
        {/* Box 1: Welcome */}
        <div className="bg-white p-8 rounded-3xl shadow-lg border-2 border-indigo-200 hover:shadow-xl transition-all duration-300 ease-in-out">
          <h3 className="text-2xl font-semibold text-indigo-600 mb-4">
            Welcome to Mountain Tech
          </h3>
          <p className="text-gray-600">
            Our mission is to simplify complex processes like membership
            registration, fundraising, and project financing with a
            user-friendly and secure platform.
          </p>
        </div>

        {/* Box 2: Our Mission */}
        <div className="bg-white p-8 rounded-3xl shadow-lg border-2 border-indigo-200 hover:shadow-xl transition-all duration-300 ease-in-out">
          <h3 className="text-2xl font-semibold text-indigo-600 mb-4">
            Our Mission
          </h3>
          <p className="text-gray-600">
            We aim to provide cutting-edge tools that enable organizations to
            grow, succeed, and achieve their goals with ease, transparency, and
            efficiency.
          </p>
        </div>

        {/* Box 3: What We Offer */}
        <div className="bg-white p-8 rounded-3xl shadow-lg border-2 border-indigo-200 hover:shadow-xl transition-all duration-300 ease-in-out">
          <h3 className="text-2xl font-semibold text-indigo-600 mb-4">
            What We Offer
          </h3>
          <ul className="space-y-3 text-gray-600">
            <li>Seamless Membership Registration</li>
            <li>Easy Project Financing & Fundraising</li>
            <li>Secure Payment Processing</li>
            <li>Powerful Admin Dashboard for Insights</li>
          </ul>
        </div>

        {/* Box 4: Join Us */}
        <div className="bg-white p-8 rounded-3xl shadow-lg border-2 border-indigo-200 hover:shadow-xl transition-all duration-300 ease-in-out">
          <h3 className="text-2xl font-semibold text-indigo-600 mb-4">
            Join Us Today!
          </h3>
          <p className="text-gray-600">
            Start using Mountain Tech to streamline your operations, manage your
            projects, and drive growth with ease. We’re here to support your
            journey!
          </p>
        </div>

        {/* Box 5: Our Values */}
        <div className="bg-white p-8 rounded-3xl shadow-lg border-2 border-indigo-200 hover:shadow-xl transition-all duration-300 ease-in-out">
          <h3 className="text-2xl font-semibold text-indigo-600 mb-4">
            Our Values
          </h3>
          <ul className="space-y-3 text-gray-600">
            <li>Integrity and Transparency</li>
            <li>Innovation and Growth</li>
            <li>Customer-Centric Approach</li>
            <li>Continuous Improvement</li>
          </ul>
        </div>

        {/* Box 6: Our Vision */}
        <div className="bg-white p-8 rounded-3xl shadow-lg border-2 border-indigo-200 hover:shadow-xl transition-all duration-300 ease-in-out">
          <h3 className="text-2xl font-semibold text-indigo-600 mb-4">
            Our Vision
          </h3>
          <p className="text-gray-600">
            Our vision is to empower organizations of all sizes to optimize
            their operations, improve project outcomes, and maximize their
            impact.
          </p>
        </div>
      </div>

      {/* Purple Accent Section */}
      <div className="bg-indigo-600 text-white py-16 mt-24 rounded-3xl text-center">
        <h3 className="text-3xl font-extrabold mb-6">Ready to Get Started?</h3>
        <p className="text-lg mb-8">
          Join thousands of organizations already benefiting from Mountain Tech.
          We make it simple, secure, and seamless.
        </p>
        <a
          href="/signup"
          className="inline-block bg-white text-indigo-600 px-8 py-3 rounded-full text-xl font-semibold hover:bg-indigo-200 transition duration-300"
        >
          Sign Up Now
        </a>
      </div>
    </div>
  );
}
