import BlogPost from '../../../components/Blog';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function EditBlogPost() {
  const router = useRouter();
  const { id } = router.query;
  const [post, setPost] = useState(null);

  useEffect(() => {
    if (!id) {
      return;
    }
    axios.get('/api/blog?id=' + id).then((response) => {
      setPost(response.data);
    });
  }, [id]);

  return (
    <div className='max-sm:p-4 '>
      <div className='sm:flex sm:items-center sm:justify-center '>
        <div className='text-center sm:text-left'>
          <p className='my-4 text-xl text-red-600'>
            Editing Blog Post:{' '}
            <span className='text-green-700'>{post?.title}</span>
          </p>
        </div>
      </div>
      <hr className='my-8 h-px border-0 bg-gray-300 ' />
      <div className='my-10 max-sm:my-12 pb-[100px] '>
        {post && <BlogPost title={post.title} content={post.content} />}
      </div>
    </div>
  );
}
