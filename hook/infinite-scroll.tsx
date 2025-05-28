"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { Post } from "@/lib/model/post";

export function useInfiniteScroll(
    endpoint: string,
) {
    const [postList, setPostList] = useState<Post[]>([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const observerRef = useRef<IntersectionObserver | null>(null);

    const loadPosts = useCallback(
        async (pageToLoad: number) => {
            if (loading || !hasMore) return;
            setLoading(true);
            try {
                const response = await fetch(`${endpoint}?page=${pageToLoad}&limit=4`);
                const json = await response.json();

                if (json.data.length === 0) {
                    setHasMore(false);
                    return;
                }

                setPostList((prev) => [...prev, ...json.data]);
                setHasMore(json.pagination.has_next_page);
                setPage(pageToLoad + 1);
            } catch (error) {
                console.error("Failed to load Posts:", error);
                setHasMore(false);
            } finally {
                setLoading(false);
            }
        },
        [endpoint, loading, hasMore]
    );

    const lastPostRef = useCallback(
        (node: HTMLElement | null) => {
            if (loading) return;
            if (observerRef.current) observerRef.current.disconnect();

            observerRef.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && hasMore) {
                    loadPosts(page);
                }
            });

            if (node && hasMore) observerRef.current.observe(node);
        },
        [loading, hasMore, loadPosts, page]
    );

    useEffect(() => {
        loadPosts(page);
    }, []);

    return {
        postList,
        loading,
        hasMore,
        lastPostRef,
    };
}