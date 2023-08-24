'use client'
import { useEffect, experimental_useOptimistic as useOptimistic } from "react"
import Likes from "./likes"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useRouter } from "next/navigation"

export default function Tweets({ tweets }: { tweets: TweetWithAuthor[] }) {

    const supabase = createClientComponentClient()
    const router = useRouter()

    useEffect( () => {
        const channel = supabase.channel("realtime tweets").on("postgres_changes", {
            event: '*',
            schema: 'public',
            table: 'tweets',
        }, (payload) => {
            console.log(payload)
            router.refresh()
        })
        .subscribe()
        return () => {
            supabase.removeChannel(channel)
        }        
    }, [supabase, router])

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