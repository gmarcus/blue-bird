import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import AuthButtonServer from './auth-button-server';
import { redirect } from 'next/navigation';
import NewTweet from './new-tweet';
import Likes from './likes';

export default async function Home() {

  const supabase = createServerComponentClient<Database>({ cookies })
  const {data: {session}} = await supabase.auth.getSession()

  // redirect if there is no session
  if (!session) {
    redirect("/login")
  }

  // We have a session, so let's show some tweets
  const { data } = await supabase
    .from('tweets')
    .select('*, author: profiles(*), likes(user_id)')

  const tweets = data?.map(tweet => ({
    ...tweet,
    author: Array.isArray(tweet.author) ? tweet.author[0] : tweet.author,
    user_has_liked_tweet: !!tweet.likes.find(like => like.user_id === session.user.id),
    likes: tweet.likes.length
  })) ?? []

  return (
    <>
      <AuthButtonServer />
      <NewTweet />
      {tweets?.map((tweet) => (
        <div className="border" key={tweet.id}>
          <p>
            {tweet.author.name} {tweet.author.username}
          </p>
          <p>{tweet.title}</p>
          <Likes tweet={tweet} />
        </div>
      ))}
    </>
  )
}
