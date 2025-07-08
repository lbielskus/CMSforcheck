export const connectToMongoDB = async () => {
  try {
    const { connectToMongoDB } = await import('../../lib/mongodb');
    return connectToMongoDB();
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
};

export const getBlogPostModel = async () => {
  try {
    const { default: BlogPost } = await import('../../models/Blog');
    return BlogPost;
  } catch (error) {
    console.error('Error importing Blog model:', error);
    throw error;
  }
};

export default async function handler(req, res) {
  try {
    await connectToMongoDB();

    const {
      query: { postId },
      method,
    } = req;

    switch (method) {
      case 'GET':
        try {
          const BlogPost = await getBlogPostModel();
          const post = await BlogPost.findById(postId);
          if (!post) {
            return res.status(404).json({ error: 'Blog post not found' });
          }
          return res.status(200).json(post);
        } catch (error) {
          console.error('Error fetching blog post:', error);
          return res
            .status(500)
            .json({ error: 'Internal server error while fetching post' });
        }
      default:
        return res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    console.error('Error connecting to database:', error);
    return res
      .status(500)
      .json({ error: 'Internal server error while connecting to database' });
  }
}
