
import { Link } from "react-router-dom";
import SectionTitle from "../SectionTitle";
import BlogCard from "../health-library/BlogCard";

import { useEffect, useState } from "react";
import { getBlogs } from "../../api/blogsApi";

export default function HomeBlogs() {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const data = await getBlogs({
          page: 1,
          limit: 4,
        });

        setBlogs(data);
      } catch (error) {
        console.error("Failed to fetch home blogs:", error);
      }
    };

    fetchBlogs();
  }, []);

  return (
    <section
  aria-label="Health library articles"
  className="section-padding bg-mist"
>
      <div className="page-container">
        <SectionTitle
          eyebrow="HEALTH LIBRARY"
          title="Knowledge for your care journey"
          description="Patient-friendly articles about cancer, diagnosis, treatment options and wellbeing."
        />

        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {blogs.slice(0, 4).map((blog) => (
            <BlogCard key={blog.id || blog.slug} blog={blog} />
          ))}
        </div>

        {/* View All Blogs Button */}
        <div className="mt-8 flex justify-center">
          <Link
            to="/health-library/blogs"
            className="inline-flex items-center justify-center rounded-full bg-royal px-7 py-3 text-sm font-bold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#963D16] hover:shadow-lg"
          >
            View All Blogs
            <span className="ml-2" aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
