import { plantService } from '../services/plantService';

// List of reliable plant image URLs that won't break
const RELIABLE_PLANT_IMAGES = [
  'https://images.unsplash.com/photo-1572078345468-80eb0b827121?q=80&w=800',
  'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?q=80&w=800',
  'https://images.unsplash.com/photo-1601985705806-5b9a71f6004f?q=80&w=800',
  'https://images.unsplash.com/photo-1637967965095-09c2d352c9b3?q=80&w=800',
  'https://images.unsplash.com/photo-1517191434949-5e90cd67d2b6?q=80&w=800',
  'https://images.unsplash.com/photo-1635407585079-ab5b3ca59356?q=80&w=800',
  'https://images.unsplash.com/photo-1599598177991-ec67ee297ba3?q=80&w=800',
  'https://images.unsplash.com/photo-1453904300235-0f2f60b15b5d?q=80&w=800',
  'https://images.unsplash.com/photo-1617173944883-61857ecc549c?q=80&w=800',
  'https://images.unsplash.com/photo-1615213612138-d1d5e1dcf701?q=80&w=800',
  // Adding 20 more reliable plant images for greater variety
  'https://images.unsplash.com/photo-1611070582321-009fa6cf9b70?q=80&w=800',
  'https://images.unsplash.com/photo-1591454371758-644f9d123a81?q=80&w=800',
  'https://images.unsplash.com/photo-1566494464008-8b5640a5c0a7?q=80&w=800',
  'https://images.unsplash.com/photo-1627471293852-183a4555e6e8?q=80&w=800',
  'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?q=80&w=800',
  'https://images.unsplash.com/photo-1622547748225-3fc4abd2cca0?q=80&w=800',
  'https://images.unsplash.com/photo-1592150621744-aca64f48388a?q=80&w=800',
  'https://images.unsplash.com/photo-1530469041783-3aaf9baedb46?q=80&w=800',
  'https://images.unsplash.com/photo-1616500789118-814c2866dce2?q=80&w=800',
  'https://images.unsplash.com/photo-1602746988678-df8d92935373?q=80&w=800',
  'https://images.unsplash.com/photo-1591958943848-bed18495e82b?q=80&w=800',
  'https://images.unsplash.com/photo-1585265325359-6bc3a27b6296?q=80&w=800',
  'https://images.unsplash.com/photo-1610630875569-f5f36df6181b?q=80&w=800',
  'https://images.unsplash.com/photo-1632321941439-67b64cb48c84?q=80&w=800',
  'https://images.unsplash.com/photo-1637967911949-c5f8619f3e62?q=80&w=800',
  'https://images.unsplash.com/photo-1620127682229-33388276e540?q=80&w=800',
  'https://images.unsplash.com/photo-1597305877032-0561d6b4526d?q=80&w=800',
  'https://images.unsplash.com/photo-1631999690821-8f8471e12693?q=80&w=800',
  'https://images.unsplash.com/photo-1603438381083-ac1f9a7d6316?q=80&w=800',
  'https://images.unsplash.com/photo-1616784155315-3a0496ff2a3d?q=80&w=800',
  // Adding 30 more plant images for even greater variety
  'https://images.unsplash.com/photo-1526565782131-a13074f0dbbb?q=80&w=800',
  'https://images.unsplash.com/photo-1593482892290-f54c7f16e9a9?q=80&w=800',
  'https://images.unsplash.com/photo-1598880940639-84e4ce36df26?q=80&w=800',
  'https://images.unsplash.com/photo-1592073047488-3691aaee3f34?q=80&w=800',
  'https://images.unsplash.com/photo-1601342630314-8427c38bf5e6?q=80&w=800',
  'https://images.unsplash.com/photo-1597305826633-575041174ae9?q=80&w=800',
  'https://images.unsplash.com/photo-1604762512526-b7506f441f2a?q=80&w=800',
  'https://images.unsplash.com/photo-1600411833114-683d76d4a600?q=80&w=800',
  'https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=800',
  'https://images.unsplash.com/photo-1505066211281-ed125c006f4c?q=80&w=800',
  'https://images.unsplash.com/photo-1613988508099-0695cee35a76?q=80&w=800',
  'https://images.unsplash.com/photo-1631173385127-cb28aae6d9bb?q=80&w=800',
  'https://images.unsplash.com/photo-1602846105985-41e9e42567a3?q=80&w=800',
  'https://images.unsplash.com/photo-1615475436242-530557052fed?q=80&w=800',
  'https://images.unsplash.com/photo-1592170752786-dd0527667c28?q=80&w=800',
  'https://images.unsplash.com/photo-1606047557233-88befaa16ec7?q=80&w=800',
  'https://images.unsplash.com/photo-1604329760661-e71dc85fd699?q=80&w=800',
  'https://images.unsplash.com/photo-1629139070629-d87bc355db85?q=80&w=800',
  'https://images.unsplash.com/photo-1590622783586-e13d6f0b44a9?q=80&w=800',
  'https://images.unsplash.com/photo-1632149877166-f75d49000351?q=80&w=800',
  'https://images.unsplash.com/photo-1602923668104-8f9e03e77b5c?q=80&w=800',
  'https://images.unsplash.com/photo-1602130707601-e16bea44c9d4?q=80&w=800',
  'https://images.unsplash.com/photo-1631381260978-7b0667eb34e4?q=80&w=800',
  'https://images.unsplash.com/photo-1630432328418-e97634cc1ea3?q=80&w=800',
  'https://images.unsplash.com/photo-1644331268183-a1e0adf518a2?q=80&w=800',
  'https://images.unsplash.com/photo-1634147090008-7e2316508bb7?q=80&w=800',
  'https://images.unsplash.com/photo-1604525667895-a2fcb5f6ab44?q=80&w=800',
  'https://images.unsplash.com/photo-1618550458986-7199fb6de60e?q=80&w=800',
  'https://images.unsplash.com/photo-1610824559115-916d96faf5f0?q=80&w=800',
  'https://images.unsplash.com/photo-1632203171982-fdfbd4de1f0c?q=80&w=800'
];

// Plant name data
const PLANT_PREFIXES = ['Giant', 'Dwarf', 'Purple', 'Red', 'Green', 'Yellow', 'White', 'Variegated', 'Mottled', 'Trailing'];
const PLANT_NAMES = ['Pothos', 'Monstera', 'Philodendron', 'Fern', 'Palm', 'Cactus', 'Aloe', 'Succulent', 'Ficus', 'Snake Plant', 
                     'ZZ Plant', 'Spider Plant', 'Peace Lily', 'Money Tree', 'Bamboo', 'Dracaena', 'Aglaonema', 'Anthurium', 'Orchid', 'Calathea'];
const SCIENTIFIC_PREFIXES = ['Epipremnum', 'Monstera', 'Philodendron', 'Nephrolepis', 'Phoenix', 'Opuntia', 'Aloe', 'Echeveria', 'Ficus', 'Sansevieria',
                            'Zamioculcas', 'Chlorophytum', 'Spathiphyllum', 'Pachira', 'Bambusa', 'Dracaena', 'Aglaonema', 'Anthurium', 'Phalaenopsis', 'Calathea'];
const SCIENTIFIC_SUFFIXES = ['aureum', 'deliciosa', 'hederaceum', 'exaltata', 'canariensis', 'microdasys', 'vera', 'elegans', 'elastica', 'trifasciata',
                           'zamiifolia', 'comosum', 'wallisii', 'aquatica', 'vulgaris', 'marginata', 'commutatum', 'andraeanum', 'amabilis', 'orbifolia'];

// Random descriptive text for plants
const DESCRIPTIONS = [
  'A perfect addition to any home or office, this plant thrives in moderate to bright indirect light. Water when the top inch of soil is dry.',
  'This beautiful plant prefers bright, indirect light and regular watering. Keep soil consistently moist but not soggy.',
  'Easy to care for, this plant tolerates low light conditions and infrequent watering. Perfect for beginners!',
  'This stunning plant features unique foliage and requires bright, indirect light. Water when the top 2 inches of soil are dry.',
  'A robust plant that can tolerate a variety of conditions. Prefers bright, indirect light and moderate watering.',
  'This low-maintenance plant thrives in bright, indirect light but can adapt to medium light. Allow soil to dry between waterings.',
  'A dramatic statement plant with striking foliage. Needs moderate light and consistent moisture.',
  'This compact plant is perfect for small spaces. Prefers bright light and regular watering.',
  "A fast-growing plant that's perfect for hanging baskets. Thrives in bright, indirect light with moderate watering.",
  'This air-purifying plant is known for its resilience. Can tolerate low light and irregular watering.'
];

// Generate a random plant
const generateRandomPlant = (index) => {
  const plantPrefix = PLANT_PREFIXES[Math.floor(Math.random() * PLANT_PREFIXES.length)];
  const plantName = PLANT_NAMES[Math.floor(Math.random() * PLANT_NAMES.length)];
  const scientificPrefix = SCIENTIFIC_PREFIXES[Math.floor(Math.random() * SCIENTIFIC_PREFIXES.length)];
  const scientificSuffix = SCIENTIFIC_SUFFIXES[Math.floor(Math.random() * SCIENTIFIC_SUFFIXES.length)];
  const description = DESCRIPTIONS[Math.floor(Math.random() * DESCRIPTIONS.length)];
  
  // Use index to cycle through available images
  const imageUrl = RELIABLE_PLANT_IMAGES[index % RELIABLE_PLANT_IMAGES.length];
  
  return {
    name: `${plantPrefix} ${plantName}`,
    scientificName: `${scientificPrefix} ${scientificSuffix}`,
    description,
    category: Math.random() > 0.5 ? 'Indoor' : 'Outdoor',
    price: parseFloat((Math.random() * 50 + 10).toFixed(2)),
    careLevel: ['Easy', 'Moderate', 'Expert'][Math.floor(Math.random() * 3)],
    image: imageUrl,
    inStock: Math.random() > 0.1 // 90% of plants are in stock
  };
};

// Seed plants in batches
export const seedPlants = async (count = 1000) => {
  console.log(`Starting to seed ${count} plants...`);
  const batchSize = 10; // Process 10 at a time to avoid overwhelming the server
  let successes = 0;
  let failures = 0;

  for (let i = 0; i < count; i += batchSize) {
    const currentBatchSize = Math.min(batchSize, count - i);
    const batch = Array.from({ length: currentBatchSize }, (_, index) => generateRandomPlant(i + index));
    
    console.log(`Processing batch ${i/batchSize + 1} of ${Math.ceil(count/batchSize)}...`);
    
    await Promise.all(batch.map(async (plant) => {
      try {
        await plantService.createPlant(plant);
        successes++;
        console.log(`Created plant: ${plant.name}`);
      } catch (error) {
        failures++;
        console.error(`Failed to create plant: ${plant.name}`, error);
      }
    }));
    
    // Small delay to avoid overwhelming the server
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log(`Seeding completed. Successfully added ${successes} plants. Failed: ${failures}`);
  return { successes, failures };
};

// Function to fix existing plants with broken images
export const fixPlantImages = async () => {
  console.log('Fetching all plants to fix images...');
  try {
    const response = await plantService.getAllPlants();
    if (!response.success) {
      throw new Error(response.message || 'Failed to fetch plants');
    }
    
    const plants = response.data;
    console.log(`Found ${plants.length} plants, checking for broken images...`);
    
    let fixedCount = 0;
    for (let i = 0; i < plants.length; i++) {
      const plant = plants[i];
      const brokenImage = !plant.image || 
                         plant.image === 'no-photo.jpg' || 
                         plant.image.includes('undefined') ||
                         plant.image === 'https://via.placeholder.com/150';
      
      if (brokenImage) {
        console.log(`Fixing broken image for plant: ${plant.name}`);
        
        // Assign a new reliable image
        const newImageUrl = RELIABLE_PLANT_IMAGES[i % RELIABLE_PLANT_IMAGES.length];
        
        try {
          await plantService.updatePlant(plant._id, { 
            ...plant, 
            image: newImageUrl 
          });
          fixedCount++;
          console.log(`Fixed image for: ${plant.name}`);
        } catch (error) {
          console.error(`Failed to update plant: ${plant.name}`, error);
        }
      }
    }
    
    console.log(`Image fix completed. Fixed ${fixedCount} plants.`);
    return { fixed: fixedCount, total: plants.length };
  } catch (error) {
    console.error('Error fixing plant images:', error);
    throw error;
  }
}; 