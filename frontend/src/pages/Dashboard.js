import { useState, useEffect } from 'react';
import { getBlogs, createBlog, updateBlog, deleteBlog } from '../api';
import { useNavigate } from 'react-router-dom';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  @keyframes gradientShift {
    0%   { background-position: 0% 50%; }
    50%  { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50%       { transform: translateY(-15px); }
  }

  @keyframes shimmer {
    0%   { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }

  .dash-bg {
    min-height: 100vh;
    background: linear-gradient(-45deg, #0f0c29, #302b63, #24243e, #1a1a2e, #16213e, #0f3460);
    background-size: 400% 400%;
    animation: gradientShift 12s ease infinite;
    font-family: 'DM Sans', sans-serif;
    color: #fff;
  }

  .navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 40px;
    background: rgba(255,255,255,0.05);
    backdrop-filter: blur(20px);
    border-bottom: 1px solid rgba(255,255,255,0.1);
    position: sticky;
    top: 0;
    z-index: 100;
  }

  .nav-brand {
    font-family: 'Playfair Display', serif;
    font-size: 24px;
    color: #fff;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .btn-logout {
    padding: 10px 20px;
    background: rgba(255,80,80,0.15);
    border: 1px solid rgba(255,80,80,0.3);
    border-radius: 10px;
    color: #ff8080;
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    transition: all 0.3s ease;
  }
  .btn-logout:hover { background: rgba(255,80,80,0.3); color: #fff; }

  .main { max-width: 900px; margin: 0 auto; padding: 40px 20px; }

  .section-title {
    font-family: 'Playfair Display', serif;
    font-size: 28px;
    margin-bottom: 24px;
    background: linear-gradient(135deg, #ff6fd8, #3813c2, #12c2e9);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .form-card {
    background: rgba(255,255,255,0.06);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255,255,255,0.12);
    border-radius: 20px;
    padding: 32px;
    margin-bottom: 40px;
    animation: fadeUp 0.6s ease forwards;
  }

  .form-input, .form-textarea {
    width: 100%;
    padding: 14px 18px;
    background: rgba(255,255,255,0.07);
    border: 1px solid rgba(255,255,255,0.12);
    border-radius: 12px;
    color: #fff;
    font-size: 15px;
    font-family: 'DM Sans', sans-serif;
    outline: none;
    transition: all 0.3s ease;
    margin-bottom: 16px;
  }

  .form-input::placeholder, .form-textarea::placeholder { color: rgba(255,255,255,0.3); }
  .form-input:focus, .form-textarea:focus {
    border-color: rgba(255,111,216,0.5);
    background: rgba(255,255,255,0.1);
    box-shadow: 0 0 0 3px rgba(255,111,216,0.1);
  }

  .form-textarea { resize: vertical; min-height: 120px; }

  .form-btns { display: flex; gap: 12px; }

  .btn-save {
    flex: 1; padding: 14px;
    background: linear-gradient(135deg, #ff6fd8, #3813c2);
    border: none; border-radius: 12px; color: #fff;
    font-size: 15px; font-weight: 500;
    font-family: 'DM Sans', sans-serif;
    cursor: pointer; transition: all 0.3s ease;
  }
  .btn-save:hover { transform: translateY(-2px); box-shadow: 0 10px 25px rgba(255,111,216,0.3); }

  .btn-cancel {
    padding: 14px 24px;
    background: rgba(255,255,255,0.08);
    border: 1px solid rgba(255,255,255,0.15);
    border-radius: 12px; color: rgba(255,255,255,0.7);
    font-size: 15px; font-family: 'DM Sans', sans-serif;
    cursor: pointer; transition: all 0.3s ease;
  }
  .btn-cancel:hover { background: rgba(255,255,255,0.15); }

  .msg-success { color: #00ff96; font-size: 14px; margin-top: 12px; }
  .msg-error { color: #ff8080; font-size: 14px; margin-top: 12px; }

  .blogs-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }

  .blog-count {
    background: linear-gradient(135deg, #ff6fd8, #3813c2);
    border-radius: 20px;
    padding: 4px 14px;
    font-size: 13px;
    font-weight: 500;
  }

  .empty-state {
    text-align: center;
    padding: 60px 20px;
    color: rgba(255,255,255,0.3);
  }
  .empty-state span { font-size: 48px; display: block; margin-bottom: 16px; animation: float 4s ease-in-out infinite; }
  .empty-state p { font-size: 16px; }

  .blog-card {
    background: rgba(255,255,255,0.05);
    backdrop-filter: blur(15px);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 16px;
    padding: 24px;
    margin-bottom: 16px;
    transition: all 0.3s ease;
    animation: fadeUp 0.5s ease forwards;
    position: relative;
    overflow: hidden;
  }

  .blog-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0;
    width: 4px; height: 100%;
    background: linear-gradient(135deg, #ff6fd8, #3813c2);
    border-radius: 4px 0 0 4px;
  }

  .blog-card:hover {
    transform: translateY(-3px);
    border-color: rgba(255,111,216,0.3);
    box-shadow: 0 15px 40px rgba(0,0,0,0.3);
  }

  .blog-title {
    font-family: 'Playfair Display', serif;
    font-size: 20px;
    margin-bottom: 10px;
    color: #fff;
  }

  .blog-content {
    color: rgba(255,255,255,0.6);
    font-size: 14px;
    line-height: 1.6;
    margin-bottom: 16px;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .blog-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .blog-date {
    color: rgba(255,255,255,0.3);
    font-size: 12px;
  }

  .card-btns { display: flex; gap: 8px; }

  .btn-edit {
    padding: 8px 16px;
    background: rgba(255,165,0,0.15);
    border: 1px solid rgba(255,165,0,0.3);
    border-radius: 8px; color: #ffb347;
    font-size: 13px; cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    transition: all 0.2s ease;
  }
  .btn-edit:hover { background: rgba(255,165,0,0.3); }

  .btn-delete {
    padding: 8px 16px;
    background: rgba(255,80,80,0.15);
    border: 1px solid rgba(255,80,80,0.3);
    border-radius: 8px; color: #ff8080;
    font-size: 13px; cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    transition: all 0.2s ease;
  }
  .btn-delete:hover { background: rgba(255,80,80,0.3); }
`;

function Dashboard() {
  const [blogs, setBlogs] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [editId, setEditId] = useState(null);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => { fetchBlogs(); }, []);

  const fetchBlogs = async () => {
    try {
      const res = await getBlogs();
      setBlogs(res.data);
    } catch {
      navigate('/');
    }
  };

  const handleSave = async () => {
    if (!title || !content) { setMessage('Please fill in both fields'); setIsSuccess(false); return; }
    try {
      if (editId) {
        await updateBlog(editId, { title, content });
        setMessage('Blog updated!'); setIsSuccess(true);
      } else {
        await createBlog({ title, content });
        setMessage('Blog created!'); setIsSuccess(true);
      }
      setTitle(''); setContent(''); setEditId(null);
      fetchBlogs();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Something went wrong');
      setIsSuccess(false);
    }
  };

  const handleEdit = (blog) => {
    setEditId(blog._id); setTitle(blog.title);
    setContent(blog.content); setMessage('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    try { await deleteBlog(id); setMessage('Blog deleted!'); setIsSuccess(true); fetchBlogs(); }
    catch { setMessage('Could not delete'); setIsSuccess(false); }
  };

  const handleLogout = () => { localStorage.removeItem('token'); navigate('/'); };

  return (
    <>
      <style>{styles}</style>
      <div className="dash-bg">
        <nav className="navbar">
          <div className="nav-brand">✍️ BlogSpace</div>
          <button className="btn-logout" onClick={handleLogout}>Logout →</button>
        </nav>

        <div className="main">
          {/* Form */}
          <div className="form-card">
            <h2 className="section-title">{editId ? '✏️ Edit Blog' : '✨ Write New Blog'}</h2>
            <input className="form-input" type="text" placeholder="Enter your blog title..." value={title} onChange={(e) => setTitle(e.target.value)} />
            <textarea className="form-textarea" placeholder="Write your blog content here..." value={content} onChange={(e) => setContent(e.target.value)} rows={5} />
            <div className="form-btns">
              <button className="btn-save" onClick={handleSave}>{editId ? 'Update Blog' : 'Publish Blog'} →</button>
              {editId && <button className="btn-cancel" onClick={() => { setEditId(null); setTitle(''); setContent(''); }}>Cancel</button>}
            </div>
            {message && <p className={isSuccess ? 'msg-success' : 'msg-error'}>{message}</p>}
          </div>

          {/* Blog List */}
          <div className="blogs-header">
            <h2 className="section-title" style={{marginBottom: 0}}>📚 My Blogs</h2>
            <span className="blog-count">{blogs.length} posts</span>
          </div>

          {blogs.length === 0 ? (
            <div className="empty-state">
              <span>📝</span>
              <p>No blogs yet — write your first one above!</p>
            </div>
          ) : (
            blogs.map((blog) => (
              <div key={blog._id} className="blog-card">
                <h3 className="blog-title">{blog.title}</h3>
                <p className="blog-content">{blog.content}</p>
                <div className="blog-footer">
                  <span className="blog-date">{new Date(blog.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                  <div className="card-btns">
                    <button className="btn-edit" onClick={() => handleEdit(blog)}>✏️ Edit</button>
                    <button className="btn-delete" onClick={() => handleDelete(blog._id)}>🗑️ Delete</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}

export default Dashboard;