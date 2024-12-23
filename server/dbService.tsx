// 'use server';

// import { LocationService, PartService, Location, Part } from './services';

// async function fetchData() {
//   try {
//     const locations = await LocationService.getAll();
//     const parts = await PartService.getAll();
//     return { locations, parts };
//   } catch (error) {
//     console.error('Error loading locations or parts:', error);
//     throw error;
//   }
// }

// export default async function Locations() {
//   let locations: Location[] = [];
//   let parts: Part[] = [];

//   try {
//     const data = await fetchData(); 
//     locations = data.locations;
//     parts = data.parts ?? [];
//   } catch (error) {
//     console.log(error);
//     return (
//       <div>
//         <p>Error loading locations or parts. Please try again later.</p>
//       </div>
//     );
//   }

//   return (
//     <div>
//       <h1>Locations</h1>
//       {locations.length > 0 ? (
//         <ul>
//           {locations.map((location) => (
//             <li key={location.locationId}>
//               <strong>{location.locationName}</strong> - {location.container} / Row: {location.row} / Position: {location.position}
//             </li>
//           ))}
//         </ul>
//       ) : (
//         <p>No locations found.</p>
//       )}
//       <h1>Parts</h1>
//       {parts.length > 0 ? (
//         <ul>
//           {parts.map((part) => (
//             <li key={part.partId}>
//               <strong>{part.partName}</strong> - {part.position} / Row: {part.row} / Details: {part.partDetails}
//             </li>
//           ))}
//         </ul>
//      ) : (
//         <p>No parts found.</p>
//       )}
//     </div>
//   );
// }
