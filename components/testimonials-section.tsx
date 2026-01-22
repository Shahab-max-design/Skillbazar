"use client"

import { Star } from "lucide-react"

const testimonials = [
  {
    name: "Fatima Hassan",
    location: "DHA, Karachi",
    rating: 5,
    text: "Found an excellent electrician within minutes. Professional service and very reasonable rates. Will definitely use SkillBazaar again!",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
  },
  {
    name: "Ali Raza",
    location: "Gulshan, Karachi",
    rating: 5,
    text: "The plumber fixed my water leak issue in no time. Great app for finding reliable technicians in Karachi.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
  },
  {
    name: "Ayesha Khan",
    location: "Clifton, Karachi",
    rating: 5,
    text: "AC repair was done perfectly. The technician was polite, on time, and knew exactly what he was doing. Highly recommended!",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
  },
]

export function TestimonialsSection() {
  return (
    <section className="py-20 bg-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">What Our Customers Say</h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Join thousands of satisfied customers who found reliable help through SkillBazaar.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-accent text-accent" />
                ))}
              </div>

              {/* Text */}
              <p className="text-gray-300 mb-6 leading-relaxed">"{testimonial.text}"</p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <img
                  src={testimonial.image || "/placeholder.svg"}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <div className="font-semibold text-white">{testimonial.name}</div>
                  <div className="text-sm text-gray-400">{testimonial.location}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
