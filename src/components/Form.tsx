import React, { useState } from 'react'
import { useEffect } from 'react'
import Statistics from './Statistics'

type Feedback = {
    feedbackType: string
    name: string
    comment: string
    rating: string
    otherFeedback?: string
}

const Form = () => {
    const [formData, setFormData] = useState<Feedback>({
        feedbackType: '',
        name: '',
        comment: '',
        rating: ''
    })

    const [allFeedback, setAllFeedback] = useState<Feedback[]>([])
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({...formData, [name]: value})
    }

    useEffect(() => {
        localStorage.removeItem("feedbacks");
        setAllFeedback([]);
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const newFeedback = [...allFeedback, formData]
        setAllFeedback(newFeedback)
        localStorage.setItem("feedbacks", JSON.stringify([...allFeedback, formData]))

        setFormData({
            feedbackType: '',
            name: '',
            comment: '',
            rating: ''
        })
    }

    type GroupedFeedback = {
        [key: string]: {
            totalRating: number
            count: number
            averageRating?: number
        }
    }

    const groupFeedbackType = (): GroupedFeedback => {
        const groupFeedback: GroupedFeedback = {}
        allFeedback.forEach((feedback)=>{
            const type = feedback.feedbackType
            if(!groupFeedback[type])
            {
                groupFeedback[type] = {totalRating: 0, count: 0}
            }
            groupFeedback[type].totalRating += Number(feedback.rating)
            groupFeedback[type].count += 1
        })

        Object.keys(groupFeedback).forEach((key) => {
        groupFeedback[key].averageRating =
            groupFeedback[key].totalRating / groupFeedback[key].count
        })

        return groupFeedback;
    }

    const groupFeedback = groupFeedbackType()
    
    return (
        <div className="container mx-auto mt-5 rounded-md bg-white shadow-lg flex items-center flex-col justify-center">
            <form onSubmit={handleSubmit} className="p-10 md:p-0 flex flex-col w-full max-w-xl gap-4 items-center">
                <h1 className="mt-4 text-4xl font-bold">Tech Assistance Feedback Form</h1>
                <h1><span className="text-red-500">*</span> is required.</h1>
                <select value={formData.feedbackType} onChange={handleChange} name="feedbackType" required className="w-full bg-gray-100 px-4 py-2 rounded-md border border-gray-400">
                    <option value="">Select Feedback Type*</option>
                    <option value="Hardware Issues">Hardware Issues</option>
                    <option value="Device Connectivity Issues">Device Connectivity Issues</option>
                    <option value="Printer Ink Request">Printer Ink Request</option>
                    <option value="Other">Other (please specify)</option>
                </select>
                {formData.feedbackType === "Other" && (
                    <input type="text" name="otherFeedback" onChange={handleChange} placeholder="Please specify...*" required className="w-full bg-gray-100 px-4 py-2 rounded-md border border-gray-400"/>
                )}
                <input onChange={handleChange} type="text" name="name" required className="w-full bg-gray-100 px-4 py-2 rounded-md border border-gray-400" placeholder="Enter your name...*"></input>
                <select onChange={handleChange} value={formData.rating} name="rating" required className="w-full bg-gray-100 px-4 py-2 rounded-md border border-gray-400">
                    <option value="">Rate Us*</option>
                    <option value="1">1. Poor</option>
                    <option value="2">2. Fair</option>
                    <option value="3">3. Good</option>
                    <option value="4">4. Great</option>
                    <option value="5">5. Excellent</option>
                </select>
                <textarea onChange={handleChange} value={formData.comment} name="comment" rows={4} className="w-full bg-gray-100 px-4 py-2 rounded-md border border-gray-400" placeholder="Please drop your valuable feedback!"></textarea>
                <button className="px-6 mt-4 mb-4 w-full py-2 bg-[#BA6B57] hover:bg-[#E0A387] rounded-md border-none outline-none text-white">Submit</button>
            </form>

            {allFeedback.length === 0 ? (
                <div className="w-full lg:w-[70%] bg-[#E0A387] p-5 shadow-md">
                    <h1 className="text-4xl text-white text-center mb-4">No feedback yet...</h1>
                </div>
                ) : (
                <Statistics
                    allFeedback={allFeedback}
                    groupFeedback={groupFeedback}
                />
            )}
        </div>
    );
}

export default Form