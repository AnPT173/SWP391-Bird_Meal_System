const foodPlanData = [
    {
      name: "Magpie-robin Normal",
      species: "Magpie-robin",
      period: "Altricial",
      status: "Normal",
      products: [
        { name: "Sunflower Seeds", quantity: 40 },
        { name: "Mixed Bird Seed", quantity: 50 },
      ],
      waterAmount: "Sufficient",
      numberOfFeedings: 1,
      note: "Provide fresh water daily."
    },
    {
      name: "Red-whispered bulbul Birth",
      species: "Red-whispered bulbul",
      period: "Passerine",
      status: "Birth",
      products: [
        { name: "Suet Cakes", quantity: 30 },
        { name: "Mealworms", quantity: 20 },
      ],
      waterAmount: "As needed",
      numberOfFeedings: 2,
      note: "Keep the feeding area clean."
    },
    {
      name: "White-rumped Shama Sick",
      species: "White-rumped Shama",
      period: "Adult",
      status: "Sick",
      products: [
        { name: "Mixed Bird Seed", quantity: 45 },
        { name: "Nyjer Thistle Seed", quantity: 55 },
      ],
      waterAmount: "Sufficient",
      numberOfFeedings: 3,
      note: "Monitor bird's condition closely.",
      medicines: [
        {
          name: "AviCalm",
          dosage: "8 oz of drinking water"
        },
        {
          name: "Featheriffic!",
          dosage: "1/8 teaspoon daily mixed with food"
        }
      ]
    },
    {
      name: "Red-rumped Shama Normal",
      species: "Red-rumped Shama",
      period: "Altricial",
      status: "Normal",
      products: [
        { name: "Suet Cakes", quantity: 40 },
        { name: "Orange", quantity: 30 },
      ],
      waterAmount: "As needed",
      numberOfFeedings: 1,
      note: "Provide a variety of fruits."
    },
    {
      name: "Seychelles magpie-robin Exotic",
      species: "Seychelles magpie-robin",
      period: "Passerine",
      status: "Exotic",
      products: [
        { name: "Banana", quantity: 25 },
        { name: "Papaya", quantity: 35 },
      ],
      waterAmount: "Sufficient",
      numberOfFeedings: 2,
      note: "Introduce new foods gradually."
    },
    {
      name: "Magpie-robin Birth",
      species: "Magpie-robin",
      period: "Passerine",
      status: "Birth",
      products: [
        { name: "Sunflower Seeds", quantity: 30 },
        { name: "Mixed Bird Seed", quantity: 40 },
      ],
      waterAmount: "As needed",
      numberOfFeedings: 2,
      note: "Keep the feeding area clean."
    },
    {
      name: "Red-whispered bulbul Normal",
      species: "Red-whispered bulbul",
      period: "Altricial",
      status: "Normal",
      products: [
        { name: "Suet Cakes", quantity: 45 },
        { name: "Mealworms", quantity: 50 },
      ],
      waterAmount: "Sufficient",
      numberOfFeedings: 1,
      note: "Provide fresh water daily."
    },
    {
      name: "White-rumped Shama Exotic",
      species: "White-rumped Shama",
      period: "Adult",
      status: "Exotic",
      products: [
        { name: "Mixed Bird Seed", quantity: 30 },
        { name: "Nyjer Thistle Seed", quantity: 25 },
      ],
      waterAmount: "As needed",
      numberOfFeedings: 2,
      note: "Introduce new foods gradually."
    },
    {
      name: "Red-rumped Shama Sick",
      species: "Red-rumped Shama",
      period: "Adult",
      status: "Sick",
      products: [
        { name: "Sunflower Seeds", quantity: 55 },
        { name: "Mixed Bird Seed", quantity: 45 },
      ],
      waterAmount: "Sufficient",
      numberOfFeedings: 3,
      note: "Monitor bird's condition closely.",
      medicines: [
        {
          name: "AviCalm",
          dosage: "8 oz of drinking water"
        },
        {
          name: "Featheriffic!",
          dosage: "1/8 teaspoon daily mixed with food"
        }
      ]
    }
  ];
  
  export default foodPlanData;
  