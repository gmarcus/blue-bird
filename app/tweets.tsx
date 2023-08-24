'use client'
import { experimental_useOptimistic as useOptimistic } from "react"
import Likes from "./likes"

export default function Tweets({ tweets }: { tweets: TweetWithAuthor[] }) {

    const [optimisticTweets, addOptimisticTweet]  = useOptimistic<TweetWithAuthor[], TweetWithAuthor>(
        tweets,
        ( currentOptimisticTweets, newTweet) => {
            // reducer (merge these two values)
            const newOptimisticTweets = [...currentOptimisticTweets]
            const index = newOptimisticTweets.findIndex( tweet => (tweet.id === newTweet.id) )
            newOptimisticTweets[index] = newTweet
            return newOptimisticTweets
        })

    return optimisticTweets.map((tweet) => (
            <div key={tweet.id}>
            <p>
                {tweet.author.name} {tweet.author.username} {tweet.title} <Likes tweet={tweet} addOptimisticTweet={addOptimisticTweet} />
            </p>
            </div>
        ))
    
}