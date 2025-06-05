import React, { useEffect, useState } from "react"
import DashboardHeader from "../../components/dashboard/DashboardHeader"
import { useAuth } from "../../context/AuthContext"
import { db } from "../../firebase/config"
import { useParams } from "react-router-dom"
import { collection, getDocs, query, where, doc, getDoc } from "firebase/firestore"
import { Alert, CircularProgress } from "@mui/material"
import TestimonialCard from "../../components/testimonials/TestimonialCard"
import TestimonialModal from "../../components/testimonials/TestimonialModal"

import EmptyState from "../../components/EmptyState"
import { FormData, Response } from "../../types/types"

const Responses: React.FC = () => {
  const { formId } = useParams<{ formId: string }>()
  const { currentUser } = useAuth()
  const [responses, setResponses] = useState<Response[]>([])
  const [formTitle, setFormTitle] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedTestimonial, setSelectedTestimonial] = useState<Response | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      if (!currentUser || !formId) return
      
      setLoading(true)
      setError(null)

      try {
        const [responseSnapshot, formSnapshot] = await Promise.all([
          getDocs(query(
            collection(db, 'testimonials'),
            where('formId', '==', formId),
            where('userId', '==', currentUser.uid)
          )),
          getDoc(doc(db, 'forms', formId))
        ])

        const fetchedResponses = responseSnapshot.docs.map(doc => ({
          id: doc.id,
          clientName: doc.data().clientName || "Anonymous",
          text: doc.data().text,
          rating: doc.data().rating || 0,
          company: doc.data().company,
          url: doc.data().url || "",
          createdAt: doc.data().createdAt?.toDate() || new Date(),
        }))

        setFormTitle((formSnapshot.data() as FormData)?.title || "Untitled Form")
        setResponses(fetchedResponses)
      } catch (err) {
        console.error("Error fetching data:", err)
        setError("Failed to load responses. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [currentUser, formId])

  return (
    <div className="flex-1 overflow-auto bg-gray-50">
      <DashboardHeader 
        title={`${formTitle} Responses`} 
        subtitle={`${responses.length} testimonial${responses.length !== 1 ? 's' : ''}`} 
      />

      <div className="p-6 max-w-7xl mx-auto">
        {loading ? (
          <div className="text-center py-8 space-y-4">
            <CircularProgress />
            <p className="text-gray-600 animate-pulse">Gathering responses...</p>
          </div>
        ) : error ? (
          <Alert 
            severity="error" 
            className="mb-4"
            onClose={() => setError(null)}
          >
            {error}
          </Alert>
        ) : responses.length === 0 ? (
          <EmptyState
            title="No responses yet"
            description="Share your form link to start collecting testimonials"
            icon="inbox"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {responses.map((testimonial:any, index) => (
              <TestimonialCard
                key={testimonial.id}
                testimonial={testimonial}
                onClick={() => setSelectedTestimonial(testimonial)}
                index={index}
              />
            ))}
          </div>
        )}
      </div>

      {selectedTestimonial && (
        <TestimonialModal
          testimonial={selectedTestimonial}
          onClose={() => setSelectedTestimonial(null)}
        />
      )}
    </div>
  )
}

export default Responses