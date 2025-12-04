
 const categoryAttributes = {
  // --- TOPWEAR ---
  Shirts: [
    { label: "Fabric", options: ["Cotton", "Linen", "Polyester Blend", "Flannel", "Denim", "Silk"] },
    { label: "Fit", options: ["Slim Fit", "Regular Fit", "Relaxed Fit", "Oversized"] },
    { label: "Sleeve Length", options: ["Long Sleeve", "Short Sleeve", "Roll-up Sleeve"] },
    { label: "Collar Type", options: ["Spread", "Button-Down", "Mandarin", "Cutaway", "Cuban"] },
    { label: "Occasion", options: ["Casual", "Formal", "Party", "Beach"] }
  ],
  
  TShirts: [
    { label: "Neck Type", options: ["Round Neck", "V-Neck", "Polo Collar", "Henley", "High Neck"] },
    { label: "Fit", options: ["Slim Fit", "Regular Fit", "Muscle Fit", "Oversized/Boxy"] },
    { label: "Sleeve Style", options: ["Half Sleeve", "Full Sleeve", "Sleeveless"] },
    { label: "Print Type", options: ["Solid", "Graphic Print", "Striped", "Tie-Dye", "All-over Print"] }
  ],

  HoodiesSweatshirts: [
    { label: "Type", options: ["Hoodie", "Sweatshirt", "Zipper Hoodie", "Pullover"] },
    { label: "Fit", options: ["Regular Fit", "Oversized", "Slim Fit"] },
    { label: "Fabric Thickness", options: ["Fleece Lined (Winter)", "French Terry (All Season)", "Lightweight"] }
  ],

  Jackets: [
    { label: "Type", options: ["Denim Jacket", "Bomber", "Leather/Biker", "Puffer", "Windbreaker", "Varsity"] },
    { label: "Closure", options: ["Zipper", "Button", "Snap Button"] },
    { label: "Hood", options: ["With Hood", "Without Hood", "Detachable Hood"] }
  ],

  SuitsBlazers: [
    { label: "Type", options: ["Blazer", "2-Piece Suit", "3-Piece Suit", "Tuxedo"] },
    { label: "Lapel", options: ["Notch Lapel", "Peak Lapel", "Shawl Lapel"] },
    { label: "Vent", options: ["Single Vent", "Double Vent", "No Vent"] }
  ],

  // --- BOTTOMWEAR ---
  Jeans: [
    { label: "Fit", options: ["Skinny", "Slim", "Tapered", "Straight", "Bootcut"] },
    { label: "Rise", options: ["Mid Rise", "Low Rise", "High Rise"] },
    { label: "Wash", options: ["Raw/Dark", "Light Wash", "Medium Wash", "Acid Wash", "Black"] },
    { label: "Stretch", options: ["Non-Stretch (Rigid)", "Comfort Stretch", "Power Stretch"] },
    { label: "Distress", options: ["Clean Look", "Knee Slit", "Highly Distressed"] }
  ],

  Pants: [
    { label: "Fabric", options: ["Cotton Twill (Chino)", "Poly-Viscose (Formal)", "Linen", "Corduroy", "Wool Blend"] },
    { label: "Fit", options: ["Slim Fit", "Regular Fit", "Tapered Fit", "Relaxed Fit"] },
    { label: "Front Style", options: ["Flat Front", "Pleated"] },
    { label: "Closure", options: ["Button", "Drawstring", "Hook & Bar"] },
    { label: "Length", options: ["Regular", "Ankle Length", "Cropped"] }
  ],

  Shorts: [
    { label: "Type", options: ["Chino Shorts", "Denim Shorts", "Cargo Shorts", "Swim Shorts", "Jersey Shorts"] },
    { label: "Length", options: ["Above Knee", "At Knee", "Below Knee"] },
    { label: "Waist", options: ["Button & Zip", "Elastic/Drawstring"] }
  ],

  JoggersTrackpants: [
    { label: "Activity", options: ["Loungewear", "Gym/Active", "Streetwear"] },
    { label: "Material", options: ["Cotton Fleece", "Nylon", "Polyester"] },
    { label: "Cuff Style", options: ["Elastic Cuff", "Zipper", "Open Hem"] }
  ],

  // --- OTHER ---
  Ethnic: [
    { label: "Type", options: ["Kurta", "Sherwani", "Nehru Jacket", "Pathani"] },
    { label: "Length", options: ["Short", "Knee Length", "Long"] },
    { label: "Work", options: ["Solid", "Embroidered", "Printed"] }
  ],

  Shoes: [
    { label: "Type", options: ["Sneakers", "Loafers", "Formal Oxfords", "Boots", "Running Shoes", "Slides/Slippers"] },
    { label: "Material", options: ["Leather", "Suede", "Canvas", "Mesh", "Synthetic"] },
    { label: "Fastening", options: ["Lace-Up", "Slip-On", "Velcro"] }
  ]
};

export default categoryAttributes