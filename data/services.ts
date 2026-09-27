export interface ServiceItem {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: string;
}

export type ServiceCategories = Record<string, ServiceItem[]>;

export const serviceCategories: ServiceCategories = {
  Electrical: [
    {
      id: "electrical-1",
      name: "Switch Replacement",
      description: "Replace damaged or faulty electrical switches.",
      price: 150,
      duration: "30 mins",
    },
    {
      id: "electrical-2",
      name: "Fan Installation",
      description: "Install ceiling or wall-mounted fans with proper asthetics.",
      price: 350,
      duration: "45 mins",
    },
    {
      id: "electrical-3",
      name: "Light Installation",
      description: "Install tube lights, bulbs or decorative lighting.",
      price: 250,
      duration: "30 mins",
    },
    {
      id: "electrical-4",
      name: "MCB Repair",
      description: "Repair or replace faulty MCBs.",
      price: 450,
      duration: "1 hour",
    },
    {
      id: "electrical-5",
      name: "House Wiring",
      description: "Complete electrical wiring for homes.",
      price: 1500,
      duration: "4-6 hours",
    },
  ],

  Plumbing: [
    {
      id: "plumbing-1",
      name: "Tap Repair",
      description: "Repair leaking or damaged taps.",
      price: 200,
      duration: "30 mins",
    },
    {
      id: "plumbing-2",
      name: "Pipe Leakage",
      description: "Repair leaking water pipes.",
      price: 350,
      duration: "45 mins",
    },
    {
      id: "plumbing-3",
      name: "Wash Basin Installation",
      description: "Install new wash basins.",
      price: 600,
      duration: "1 hour",
    },
    {
      id: "plumbing-4",
      name: "Toilet Repair",
      description: "Fix flush tanks and toilet fittings.",
      price: 700,
      duration: "1 hour",
    },
    {
      id: "plumbing-5",
      name: "Water Tank Cleaning",
      description: "Professional tank cleaning service.",
      price: 1000,
      duration: "2 hours",
    },
  ],

  "AC Repair": [
    {
      id: "ac-1",
      name: "AC General Service",
      description: "Complete AC servicing and cleaning.",
      price: 600,
      duration: "1 hour",
    },
    {
      id: "ac-2",
      name: "Gas Refilling",
      description: "Refill refrigerant gas.",
      price: 1800,
      duration: "1 hour",
    },
    {
      id: "ac-3",
      name: "AC Installation",
      description: "Install split or window AC.",
      price: 1200,
      duration: "2 hours",
    },
    {
      id: "ac-4",
      name: "AC Uninstallation",
      description: "Remove AC safely.",
      price: 800,
      duration: "1 hour",
    },
    {
      id: "ac-5",
      name: "Cooling Issue Repair",
      description: "Diagnose and repair cooling problems.",
      price: 900,
      duration: "1 hour",
    },
  ],

  "Appliance Repair": [
    {
      id: "app-1",
      name: "TV Repair",
      description: "Repair LED/LCD televisions.",
      price: 500,
      duration: "1 hour",
    },
    {
      id: "app-2",
      name: "Refrigerator Repair",
      description: "Repair refrigerators and freezers.",
      price: 800,
      duration: "1 hour",
    },
    {
      id: "app-3",
      name: "Washing Machine Repair",
      description: "Repair fully and semi automatic machines.",
      price: 700,
      duration: "1 hour",
    },
    {
      id: "app-4",
      name: "Microwave Repair",
      description: "Repair microwave ovens.",
      price: 600,
      duration: "45 mins",
    },
    {
      id: "app-5",
      name: "RO Service",
      description: "RO maintenance and filter replacement.",
      price: 500,
      duration: "45 mins",
    },
  ],

  Carpentry: [
    {
      id: "carp-1",
      name: "Door Repair",
      description: "Repair wooden doors and locks.",
      price: 400,
      duration: "45 mins",
    },
    {
      id: "carp-2",
      name: "Furniture Assembly",
      description: "Assemble new furniture.",
      price: 600,
      duration: "1 hour",
    },
    {
      id: "carp-3",
      name: "Cupboard Repair",
      description: "Repair cupboards and wardrobes.",
      price: 700,
      duration: "1 hour",
    },
    {
      id: "carp-4",
      name: "Bed Repair",
      description: "Repair wooden beds.",
      price: 800,
      duration: "1 hour",
    },
    {
      id: "carp-5",
      name: "Shelf Installation",
      description: "Install wall shelves.",
      price: 500,
      duration: "45 mins",
    },
  ],

  Painting: [
    {
      id: "paint-1",
      name: "Wall Painting",
      description: "Professional wall painting.",
      price: 1200,
      duration: "2 hours",
    },
    {
      id: "paint-2",
      name: "Room Painting",
      description: "Complete room painting.",
      price: 3500,
      duration: "1 day",
    },
    {
      id: "paint-3",
      name: "Texture Painting",
      description: "Decorative texture finishes.",
      price: 5000,
      duration: "1 day",
    },
    {
      id: "paint-4",
      name: "Exterior Painting",
      description: "Exterior house painting.",
      price: 8000,
      duration: "2 days",
    },
    {
      id: "paint-5",
      name: "Ceiling Painting",
      description: "Ceiling repainting service.",
      price: 1500,
      duration: "2 hours",
    },
  ],

  Cleaning: [
    {
      id: "clean-1",
      name: "Bathroom Cleaning",
      description: "Deep bathroom cleaning.",
      price: 600,
      duration: "1 hour",
    },
    {
      id: "clean-2",
      name: "Kitchen Cleaning",
      description: "Complete kitchen cleaning.",
      price: 900,
      duration: "2 hours",
    },
    {
      id: "clean-3",
      name: "Sofa Cleaning",
      description: "Professional sofa shampooing.",
      price: 700,
      duration: "1 hour",
    },
    {
      id: "clean-4",
      name: "Deep Home Cleaning",
      description: "Complete house deep cleaning.",
      price: 3000,
      duration: "5 hours",
    },
    {
      id: "clean-5",
      name: "Water Tank Cleaning",
      description: "Underground and overhead tank cleaning.",
      price: 1200,
      duration: "2 hours",
    },
  ],
};
