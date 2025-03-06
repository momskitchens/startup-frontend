import React, { useState, useEffect } from 'react';
import { LoadingOverlay } from '../../components/LoadingSpinner';

const MomCard = ({ mom }) => (
  <div className="bg-orange-50 hover:bg-orange-100 transition-colors duration-300 cursor-pointer rounded-lg shadow-md overflow-hidden">
    <div className="p-6">
      <div className="flex flex-col items-center">
        <img 
          src={mom.avatar} 
          alt={mom.username} 
          className="w-24 h-24 rounded-full object-cover mb-4"
        />
        <h3 className="text-xl font-semibold text-orange-800 mb-2">{mom.username}</h3>
        <p className="text-orange-700 text-center">{mom.description}</p>
      </div>
    </div>
  </div>
);

const MomsPage = () => {
  const [moms, setMoms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    fetchMoms();
  }, [page]);

  const fetchMoms = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_BACKEND_API}/moms/moms-page?page=${page}&limit=8`, {
        method: 'GET',
        credentials:"include",
        headers: {
          'Content-Type': 'application/json',
          // Add any required headers like authentication tokens
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch moms');
      }

      setMoms(prev => page === 1 ? data.data.moms : [...prev, ...data.data.moms]);
      setHasMore(data.data.pagination.hasNext);
      setError(null);
    } catch (error) {
      console.error('Error details:', error);
      setError('Failed to load profiles. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-orange-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-orange-800 text-center mb-12">
          Queens behind ghar ka khana
        </h1>
        
        {error && (
          <div className="text-red-500 text-center mb-6 p-4 bg-red-50 rounded-lg">
            {error}
          </div>
        )}

        {loading && page === 1 ? (
          <LoadingOverlay text="loading moms" />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {moms.map((mom) => (
                <MomCard key={mom._id} mom={mom} />             
              ))}
            </div>
            
            {moms.length === 0 && !loading && (
              <div className="text-center text-orange-800 text-lg mt-8">
                No caregivers found.
              </div>
            )}
            
            {hasMore && (
              <div className="mt-8 flex justify-center">
                <button
                  onClick={() => setPage(prev => prev + 1)}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-300 disabled:opacity-50"
                  disabled={loading}
                >
                  {loading ? <LoadingOverlay text="loading moms" /> : (
                    'Load More'
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MomsPage;