'use client'
import { useEffect, experimental_useOptimistic as useOptimistic } from "react"
import Likes from "./likes"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useRouter } from "next/navigation"
import Image from "next/image"

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
            <div className="border border-gray-800 border-t-0 px-4 py-8 flex"
            key={tweet.id}>
                <div className="w-12 h-12 ">
                  <Image className="rounded-full" width={48} height={48}
                  src={tweet.author.avatar_url} alt="tweet user avatar" />
                </div>
                <div className="ml-4">
                    <p>
                        <span className="font-bold">{tweet.author.username}</span>
                        <span className="text-sm ml-2 text-gray-400">{tweet.author.name}</span>
                    </p>
                    <p className="text-xl">
                        {tweet.title} 
                    </p>
                    <Likes tweet={tweet} addOptimisticTweet={addOptimisticTweet} />
                </div>
            </div>
        ))
    
}