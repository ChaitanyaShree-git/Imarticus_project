import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

export default function MovieReviews() {
  const { title } = useParams();
  const navigate = useNavigate();

  const [reviews, setReviews] = useState([]);
  const [content, setContent] = useState('');
  const [rating, setRating] = useState('');
  const [editingReviewId, setEditingReviewId] = useState(null);
  

  const token = localStorage.getItem('token');
  const currentUser = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (!token) return navigate('/login');
    fetchReviews();
  }, [title]);

  const fetchReviews = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/reviews/${title}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setReviews(res.data.reviews);
      setAverageRating(res.data.averageRating);
    } catch (err) {
      console.error('Error fetching reviews:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content || !rating) return alert('Please fill all fields');

    try {
      if (editingReviewId) {
        await axios.patch(
          `http://localhost:3000/reviews/${title}/${editingReviewId}`,
          { content, rating: Number(rating) },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setEditingReviewId(null);
      } else {
        await axios.post(
          `http://localhost:3000/reviews/${title}`,
          { content, rating: Number(rating) },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      setContent('');
      setRating('');
      fetchReviews();
    } catch (err) {
      console.error('Submit error:', err);
      alert(err?.response?.data?.error || 'Submit failed');
    }
  };

  const handleEdit = (review) => {
    setEditingReviewId(review._id);
    setContent(review.content);
    setRating(review.rating);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this review?')) return;
    try {
      await axios.delete(`http://localhost:3000/reviews/${title}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchReviews();
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  return (
    <div style={{ padding: '2rem', backgroundColor: '#f9f9f9' }}>
      <h2>Reviews for: {title}</h2>

      <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows="3"
          placeholder="Write your review..."
          style={{ width: '100%', padding: '0.5rem' }}
        />
        <select
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          style={{ marginTop: '0.5rem' }}
        >
          <option value="">Select Rating</option>
          {[5, 4, 3, 2, 1].map((star) => (
            <option key={star} value={star}>{star} Star{star > 1 ? 's' : ''}</option>
          ))}
        </select>
        <br />
        <button type="submit" style={{ marginTop: '0.5rem' }}>
          {editingReviewId ? 'Update Review' : 'Submit Review'}
        </button>
      </form>

      <div>
        {reviews.length === 0 ? (
          <p>No reviews yet.</p>
        ) : (
          reviews.map((review) => (
            <div key={review._id} style={{
              border: '1px solid #ddd',
              borderRadius: '10px',
              padding: '1rem',
              marginBottom: '1rem'
            }}>
              <p><strong>{review.username}</strong> rated ⭐ {review.rating} / 5</p>
              <p>{review.content}</p>
              {review.userId === currentUser?.id && (
                <div style={{ marginTop: '0.5rem' }}>
                  <button onClick={() => handleEdit(review)}>Edit</button>{' '}
                  <button onClick={() => handleDelete(review._id)}>Delete</button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
