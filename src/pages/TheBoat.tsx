import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import * as d3 from "d3";
import Footer from "../Components/Footer.tsx";

// Theme colors
const YELLOW = "#FFD700"; // Bright yellow for primary brand color
const TEAL = "#40E0D0"; // Vibrant teal
const LIGHT_TEAL = "#7FFFD4"; // Lighter teal (Aquamarine)
const DARK_TEAL = "#20B2AA"; // Dark teal (LightSeaGreen)
const DEEP_TEAL = "#008080"; // Deep teal (Teal)
const WHITE = "#FFFFFF"; // White for text and contrast
const SAND = "#F5F5DC"; // Light sand color for subtle elements
const OFF_WHITE = "#F0F0F0"; // Off-white for text on darker backgrounds

interface ChartDataPoint {
  name: string;
  elevation: number;
  color: string;
}

// Sample testimonials
const testimonials = [
  {
    id: 1,
    name: "Sarah T.",
    text:
      "What a thrill! The Cloud Dancer gave us an incredible view of Flathead Lake and the mountains!",
  },
  {
    id: 2,
    name: "Mike D.",
    text:
      "Perfect family adventure. The captain was professional and the boat felt very safe.",
  },
  {
    id: 3,
    name: "Jessica M.",
    text:
      "Best part of our vacation in Montana! The views from above Flathead Lake were unforgettable.",
  },
];

// Updated boat specifications based on CWS/Ocean Pro information
const boatSpecifications = [
  { name: "Make", value: "Commercial Water Sports Inc" },
  { name: "Model", value: "Cloud Dancer (Ocean Pro 31)" },
  { name: "Year", value: "2006" },
  { name: "Length", value: "31'0\"" },
  { name: "Beam", value: "10'06\"" },
  { name: "Draft", value: "3'01\"" },
  { name: "Hull Configuration", value: "Modified deep 'V'" },
  { name: "Hull Material", value: "Hand laid molded fiberglass" },
  { name: "Engine", value: "Volvo Penta DS-3704-1 diesel" },
  { name: "Fuel Capacity", value: "2 x 75 gallon aluminum saddle tanks" },
];

// Construction features
const constructionFeatures = [
  "Hand laid molded fiberglass hull and deck",
  "Deck-to-hull bonded chemically & mechanically",
  "Fiberglass wrapped encapsulated plywood stringer system",
  "Non-skid finish on all decks",
  "Self-bailing deck design",
  "Under seat storage compartments",
];

// Parasail equipment
const parasailEquipment = [
  "Fixed aluminum inflation arch with captain's bimini",
  "Rotating swivel with tri-roller head",
  "Stainless steel line guide system",
  "Heavy-duty winch with line leveling system",
  "Custom hydraulic system",
  "Aluminum harness rail in bow",
];

// Updated safety features
const safetyFeatures = [
  "USCG Certificate of Inspection",
  "Rule 1200 GPH bilge pumps",
  "USCG approved navigational lights",
  "USCG rated fuel lines and systems",
  "Racor 500 fuel filtering system",
  "Child and adult Type II PFDs",
  "Type V life rings",
  "Multiple fire extinguishers",
];

// Main component
const ParasailBoat = () => {
  const [activeTab, setActiveTab] = useState("about");
  const [chartData, setChartData] = useState<ChartDataPoint[] | null>(null);
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);

  // Generate sample chart data showing elevation comparison
  useEffect(() => {
    const data: ChartDataPoint[] = [
      { name: "Lake Tahoe", elevation: 6300, color: DEEP_TEAL },
      { name: "Flathead Lake", elevation: 2996, color: TEAL },
    ];
    setChartData(data);
  }, []);

  // Testimonial auto-rotation
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonialIndex((prevIndex) =>
        prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  // Bar chart component for elevation comparison
  const ElevationChart = ({ data }: { data: ChartDataPoint[] }) => {
    const svgRef = React.useRef<SVGSVGElement>(null);

    useEffect(() => {
      if (!data || !svgRef.current) return;

      // Clear previous chart
      d3.select(svgRef.current).selectAll("*").remove();

      // Chart dimensions
      const width = 300;
      const height = 200;
      const margin = { top: 20, right: 20, bottom: 40, left: 60 };

      // Create SVG
      const svg = d3.select(svgRef.current)
        .attr("width", width)
        .attr("height", height);

      // Scales
      const xScale = d3.scaleBand()
        .domain(data.map((d) => d.name))
        .range([margin.left, width - margin.right])
        .padding(0.3);

      const yScale = d3.scaleLinear()
        .domain([0, d3.max(data, (d) => d.elevation) * 1.1])
        .range([height - margin.bottom, margin.top]);

      // Draw bars
      svg.selectAll(".bar")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", (d) => xScale(d.name))
        .attr("y", (d) => yScale(d.elevation))
        .attr("width", xScale.bandwidth())
        .attr("height", (d) => height - margin.bottom - yScale(d.elevation))
        .attr("fill", (d) => d.color)
        .attr("rx", 4) // Rounded corners
        .attr("ry", 4);

      // Add labels
      svg.selectAll(".label")
        .data(data)
        .enter()
        .append("text")
        .attr("class", "label")
        .attr("x", (d) => xScale(d.name) + xScale.bandwidth() / 2)
        .attr("y", (d) => yScale(d.elevation) - 5)
        .attr("text-anchor", "middle")
        .attr("fill", WHITE)
        .text((d) => d.elevation + "ft");

      // X-axis
      svg.append("g")
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(xScale))
        .selectAll("text")
        .attr("font-size", "12px")
        .attr("transform", "rotate(-15)")
        .attr("text-anchor", "end");

      // Y-axis
      svg.append("g")
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(yScale).tickFormat((d) => d + "ft"))
        .selectAll("text")
        .attr("font-size", "12px");

      // Y-axis label
      svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", margin.left / 3)
        .attr("x", -(height / 2))
        .attr("text-anchor", "middle")
        .attr("fill", DEEP_TEAL)
        .attr("font-weight", "bold")
        .text("Elevation");
    }, [data]);

    return <svg ref={svgRef} className="w-full max-w-md mx-auto"></svg>;
  };

  return (
    <div className="w-full min-h-screen font-sans bg-gradient-to-b from-white to-blue-50">
      {/* Header/Hero Section with fixed image path */}
      <motion.header
        className="relative h-96 bg-cover bg-center flex items-center justify-center"
        style={{
            backgroundImage: 'url("/cloudDancerInclineDock.jpg")',
            
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="text-center z-10">
          <motion.h1
            className="text-5xl font-bold text-white mb-4 tracking-wider"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            Cloud Dancer
          </motion.h1>
          <motion.p
            className="text-xl text-white"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
          >
            The ultimate parasail experience
          </motion.p>
        </div>
      </motion.header>

      {/* Navigation Tabs */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-center mb-8">
          <div className="flex flex-wrap space-x-1 p-1 bg-white rounded-xl shadow">
            {["about", "construction", "equipment", "safety", "elevation"].map((
              tab,
            ) => (
              <button
                key={tab}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                  activeTab === tab
                    ? "bg-teal-500 text-white"
                    : "text-teal-600 hover:bg-teal-100"
                }`}
                style={activeTab === tab
                  ? { backgroundColor: DARK_TEAL, color: WHITE }
                  : { color: DEEP_TEAL }}
                onClick={() => setActiveTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Content Sections */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto"
          >
            {/* About Tab */}
            {activeTab === "about" && (
              <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
                <h2
                  className="text-3xl font-bold mb-6"
                  style={{ color: DARK_TEAL }}
                >
                  About Cloud Dancer
                </h2>
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div>
                    <p className="text-gray-700 mb-4">
                      Welcome aboard the Cloud Dancer, our premier parasail
                      vessel manufactured by Commercial Water Sports Inc. Based
                      on the Ocean Pro 31 design, it's known in the industry as
                      the "heavyweight champion of parasail vessels."
                    </p>
                    <p className="text-gray-700 mb-4">
                      Formerly operated on Lake Tahoe, this purpose-built 2006
                      parasail boat is now your gateway to thrilling adventures
                      on the beautiful waters of Flathead Lake, Montana's
                      largest natural freshwater lake.
                    </p>
                    <p className="text-gray-700">
                      Designed for dependability, reliability, and safety, our
                      experienced crew will take you up to 500 feet above the
                      water, offering breathtaking panoramic views of Flathead
                      Lake, the Mission Mountains, and the surrounding
                      wilderness.
                    </p>
                  </div>
                  <div className="bg-gray-100 rounded-lg p-4">
                    <img
                      src="/cloudDancerTransom.png"
                      alt="Cloud Dancer boat"
                      className="w-full h-auto rounded-lg shadow"
                    />
                    <p className="text-sm text-gray-500 mt-2 text-center italic">
                      Cloud Dancer - Your gateway to unforgettable parasailing
                      adventures
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Construction Tab */}
            {activeTab === "construction" && (
              <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
                <h2
                  className="text-3xl font-bold mb-6"
                  style={{ color: DARK_TEAL }}
                >
                  Vessel Construction
                </h2>
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3
                      className="text-xl font-semibold mb-4"
                      style={{ color: TEAL }}
                    >
                      Specifications
                    </h3>
                    <div className="space-y-2">
                      {boatSpecifications.slice(0, 6).map((spec, index) => (
                        <div
                          key={index}
                          className="flex justify-between py-2 border-b border-gray-100"
                        >
                          <span className="font-medium text-gray-700">
                            {spec.name}:
                          </span>
                          <span className="text-gray-600">{spec.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3
                      className="text-xl font-semibold mb-4"
                      style={{ color: TEAL }}
                    >
                      Construction Features
                    </h3>
                    <ul className="space-y-2">
                      {constructionFeatures.map((feature, index) => (
                        <li key={index} className="flex items-start py-1">
                          <svg
                            className="h-5 w-5 mr-2 text-teal-500 flex-shrink-0"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="mt-8">
                  <h3
                    className="text-xl font-semibold mb-4"
                    style={{ color: TEAL }}
                  >
                    Hardware & Systems
                  </h3>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h4
                        className="font-semibold mb-2"
                        style={{ color: DARK_TEAL }}
                      >
                        Hull Hardware
                      </h4>
                      <ul className="text-gray-700 space-y-1">
                        <li>• Stainless steel bow and stern eyes</li>
                        <li>• Stainless steel bow and stern cleats</li>
                        <li>• Stainless steel hardware and thru-hulls</li>
                        <li>• Aluminum hand rails and safety features</li>
                      </ul>
                    </div>
                    <div>
                      <h4
                        className="font-semibold mb-2"
                        style={{ color: DARK_TEAL }}
                      >
                        Systems
                      </h4>
                      <ul className="text-gray-700 space-y-1">
                        <li>• 12-volt electrical system</li>
                        <li>• Dual battery setup with switch</li>
                        <li>• Racor fuel filtration system</li>
                        <li>• USCG compliant wiring and components</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Equipment Tab */}
            {activeTab === "equipment" && (
              <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
                <h2
                  className="text-3xl font-bold mb-6"
                  style={{ color: DARK_TEAL }}
                >
                  Parasail Equipment
                </h2>
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3
                      className="text-xl font-semibold mb-4"
                      style={{ color: TEAL }}
                    >
                      Specialized Features
                    </h3>
                    <ul className="space-y-2">
                      {parasailEquipment.map((item, index) => (
                        <li key={index} className="flex items-start py-1">
                          <svg
                            className="h-5 w-5 mr-2 text-teal-500 flex-shrink-0"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          <span className="text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <h3
                      className="text-xl font-semibold mb-4"
                      style={{ color: TEAL }}
                    >
                      Helm Station
                    </h3>
                    <div className="space-y-2 text-gray-700">
                      <p>• Fiberglass console with protected switch panel</p>
                      <p>• Stainless steel steering wheel with knob</p>
                      <p>• Dedicated winch controls</p>
                      <p>• Tinted windshield for operator comfort</p>
                      <p>• Dry helm storage locker</p>
                      <p>• Full instrumentation package</p>
                    </div>

                    <div className="mt-6 p-3 bg-white rounded border border-teal-100">
                      <p className="text-gray-600 italic text-sm">
                        "The Ocean Pro 31 is the undisputed heavy-weight
                        champion of para-sail vessels, the standard to which all
                        others aspire!"
                      </p>
                      <p className="text-right text-xs text-gray-500 mt-1">
                        - Commercial Water Sports Inc.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-6 py-4">
                  <p className="text-center text-gray-700">
                    Our Cloud Dancer parasail boat is equipped with a complete,
                    professional-grade parasail setup, allowing us to offer safe
                    and thrilling flights up to 500 feet above the beautiful
                    waters of Flathead Lake.
                  </p>
                </div>
              </div>
            )}

            {/* Safety Tab */}
            {activeTab === "safety" && (
              <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
                <h2
                  className="text-3xl font-bold mb-6"
                  style={{ color: DARK_TEAL }}
                >
                  Safety Features
                </h2>
                <p className="text-gray-700 mb-6">
                  Your safety is our top priority. The Cloud Dancer is fully
                  equipped with all required USCG safety equipment and has been
                  professionally inspected.
                </p>
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3
                      className="text-xl font-semibold mb-4"
                      style={{ color: TEAL }}
                    >
                      Safety Equipment
                    </h3>
                    <ul className="space-y-2">
                      {safetyFeatures.map((feature, index) => (
                        <li key={index} className="flex items-start py-2">
                          <svg
                            className="h-6 w-6 mr-2 text-green-500 flex-shrink-0"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-5">
                    <h3
                      className="text-xl font-semibold mb-4"
                      style={{ color: TEAL }}
                    >
                      What Our Customers Say
                    </h3>
                    <div className="relative h-48">
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={currentTestimonialIndex}
                          initial={{ opacity: 0, x: 50 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -50 }}
                          transition={{ duration: 0.5 }}
                          className="absolute inset-0"
                        >
                          <div className="bg-white rounded-lg p-4 shadow-sm h-full flex flex-col justify-between">
                            <p className="text-gray-600 italic">
                              "{testimonials[currentTestimonialIndex].text}"
                            </p>
                            <p className="text-right font-medium text-gray-700 mt-2">
                              — {testimonials[currentTestimonialIndex].name}
                            </p>
                          </div>
                        </motion.div>
                      </AnimatePresence>
                    </div>
                    <div className="flex justify-center mt-4">
                      {testimonials.map((_, index) => (
                        <button
                          key={index}
                          className={`w-3 h-3 mx-1 rounded-full ${
                            currentTestimonialIndex === index
                              ? "bg-teal-500"
                              : "bg-gray-300"
                          }`}
                          style={{
                            backgroundColor: currentTestimonialIndex === index
                              ? DARK_TEAL
                              : "#e2e8f0",
                          }}
                          onClick={() => setCurrentTestimonialIndex(index)}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Elevation Tab */}
            {activeTab === "elevation" && (
              <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
                <h2
                  className="text-3xl font-bold mb-6"
                  style={{ color: DARK_TEAL }}
                >
                  Elevation Comparison
                </h2>
                <p className="text-gray-700 mb-6">
                  The Cloud Dancer previously operated on Lake Tahoe before
                  finding its new home on Flathead Lake. Here's how these two
                  magnificent lakes compare in elevation:
                </p>
                <div className="mb-8">
                  {chartData && <ElevationChart data={chartData} />}
                </div>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3
                      className="text-xl font-semibold mb-2"
                      style={{ color: TEAL }}
                    >
                      Lake Tahoe
                    </h3>
                    <p className="text-gray-700 mb-2">
                      At 6,300 feet above sea level, Lake Tahoe is one of the
                      highest elevation lakes in the United States. The Cloud
                      Dancer operated successfully in this high-altitude
                      environment, demonstrating its exceptional performance
                      capabilities.
                    </p>
                    <p className="text-gray-700">
                      High elevation operations require specialized equipment
                      and expertise, which our vessel and team have mastered.
                    </p>
                  </div>
                  <div className="bg-teal-50 p-4 rounded-lg">
                    <h3
                      className="text-xl font-semibold mb-2"
                      style={{ color: TEAL }}
                    >
                      Flathead Lake
                    </h3>
                    <p className="text-gray-700 mb-2">
                      At 2,996 feet elevation, Flathead Lake offers optimal
                      conditions for parasailing. The lower elevation provides
                      better engine performance and more favorable air density
                      for parasail operations.
                    </p>
                    <p className="text-gray-700">
                      This means smoother takeoffs, more stable flights, and an
                      overall enhanced experience for our guests on the Cloud
                      Dancer.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="container mx-auto px-4 py-10">
        <div className="max-w-4xl mx-auto bg-teal-900 bg-opacity-10 rounded-xl p-6 text-center">
          <h2 className="text-2xl font-bold mb-4" style={{ color: DARK_TEAL }}>
            Ready for an Unforgettable Adventure?
          </h2>
          <p className="text-gray-300 mb-6">
            Experience the thrill of soaring above Flathead Lake on the Cloud
            Dancer, a vessel designed for safety, reliability, and the ultimate
            parasailing experience.
          </p>
          <button
            className="px-8 py-3 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition-colors"
            style={{ backgroundColor: DARK_TEAL }}
          >
            Book Your Flight Today
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ParasailBoat;