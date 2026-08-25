// Format currency into INR
export const formatCurrency = (amount) => {
  if (amount === undefined || amount === null) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
};

// Format Date
export const formatDate = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};

export const formatDateTime = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Status Badge Helper
export const getStatusBadgeColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'delivered':
    case 'paid':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    case 'shipped':
      return 'bg-blue-50 text-blue-700 border-blue-200';
    case 'processing':
      return 'bg-amber-50 text-amber-700 border-amber-200';
    case 'placed':
    case 'pending':
      return 'bg-purple-50 text-purple-700 border-purple-200';
    case 'cancelled':
    case 'failed':
      return 'bg-rose-50 text-rose-700 border-rose-200';
    default:
      return 'bg-stone-50 text-stone-700 border-stone-200';
  }
};
