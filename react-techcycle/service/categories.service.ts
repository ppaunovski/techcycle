import React from "react";

export interface Category {
    id: number,
    categoryName: string,
    description: string,
}

export interface Tag {
    id: number,
    name: string,
    description: string,
}

export const fetchCategories = async (setCategories: React.Dispatch<React.SetStateAction<Category[]>>, setError: any | undefined | null) => {
    try {
        const response = await fetch("/api/categories", {
            headers: {
                "Authorization": `Bearer ${localStorage.getItem('token')}`
            }
        }); // Replace with your backend endpoint
        if (!response.ok) {
            throw new Error("Failed to fetch categories");
        }
        const data = await response.json();
        setCategories(data);
        console.log(data)
    } catch (error) {
        if (setError) {
            setError(error);
        }
        console.error(error)
    }
}

export const fetchTags = async (setTags: React.Dispatch<React.SetStateAction<Tag[]>>, setError: any) => {
    try {
        const response = await fetch("/api/tags", {
            headers: {
                "Authorization": `Bearer ${localStorage.getItem('token')}`
            }
        }); // Replace with your backend endpoint
        if (!response.ok) {
            throw new Error("Failed to fetch tags");
        }
        const data = await response.json();
        setTags(data);
    } catch (error) {
        if (setError) {
            setError(error);
        }
        console.error(error)
    }
}