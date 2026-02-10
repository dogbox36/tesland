'use client';

export default function LogoutButton() {
    return (
        <button
            onClick={() => {
                if (typeof window !== 'undefined') {
                    localStorage.removeItem('token');
                    window.location.href = '/login';
                }
            }}
            className="text-xs text-red-500 hover:text-red-400 mt-2 block"
        >
            Log Out
        </button>
    );
}
