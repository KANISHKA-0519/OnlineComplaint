import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div className="rounded bg-white p-6 shadow">
      <h2 className="text-2xl font-semibold">404 - Page Not Found</h2>
      <p className="mt-2 text-slate-600">The page you are looking for does not exist.</p>
      <Link to="/" className="mt-4 inline-block rounded bg-emerald-600 px-4 py-2 text-white">
        Go to Dashboard
      </Link>
    </div>
  );
};

export default NotFoundPage;
