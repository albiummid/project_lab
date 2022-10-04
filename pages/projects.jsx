// import React from 'react'
// import ProjectSection from '../components/projects/Project_Section'

// export default function Projects() {
//   const project_sections = [
//     {
//       name: 'Backlog',
//       count: 6,
//     },
//     {
//       name: 'Ready',
//       count: 6,
//     },
//     {
//       name: 'Doing',
//       count: 6,
//     },
//     {
//       name: 'Review',
//       count: 6,
//     },
//     {
//       name: 'Blocked',
//       count: 6,
//     },
//     {
//       name: 'Done',
//       count: 6,
//     },
//   ]
//   return (
//     <main>
//       <div className='px-10 mt-6'>
//         <h1 className='text-2xl font-bold'>Project Board</h1>
//       </div>

//       <section className='flex flex-grow px-10 mt-4 space-x-6 overflow-auto'>
//         {project_sections?.map((item, key) => (
//           <ProjectSection
//             section_name={item.name}
//             project_count={item.count}
//             key={key}
//           />
//         ))}
//       </section>
//     </main>
//   )
// }
