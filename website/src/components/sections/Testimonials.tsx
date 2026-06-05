import { getCmsPath } from "@/lib/cms-path";
import { getSiteContent } from "@/lib/cms-loader";
import { getTestimonials } from "@/lib/data";
import TestimonialsCarousel from "./TestimonialsCarousel";

export default async function Testimonials() {
  const content = await getSiteContent();
  const copy = getCmsPath<Record<string, string>>(content, "home.testimonials");
  const carouselAria = getCmsPath<string>(content, "common.aria.testimonialCarousel");
  const testimonials = await getTestimonials();

  return (
    <TestimonialsCarousel
      testimonials={testimonials}
      copy={copy}
      carouselAria={carouselAria}
    />
  );
}
