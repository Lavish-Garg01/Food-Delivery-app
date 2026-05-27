import { Link, useSearchParams } from "react-router-dom";

export default function OrderSuccess() {
  const [params] = useSearchParams();
  const orderId = params.get("orderId");

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-xl p-10 max-w-md w-full text-center">
        <div className="text-7xl mb-4 animate-bounce">🎉</div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Order Placed!</h1>
        <p className="text-gray-500 mb-2">Your food is being prepared with ❤️</p>
        <p className="text-gray-400 text-sm mb-8">Estimated delivery: <strong>30-40 minutes</strong></p>

        <div className="flex flex-col gap-3">
          {orderId && (
            <Link to={`/orders/${orderId}`} className="btn-primary w-full text-center">
              Track Order 🚴
            </Link>
          )}
          <Link to="/restaurants" className="btn-secondary w-full text-center">
            Order More
          </Link>
        </div>
      </div>
    </div>
  );
}