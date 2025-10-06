// import { Card, Text, Box } from '@mantine/core'

// const TotalCard = ({ data }) => {
//     console.log(data)
//   return (
//     <Box pl={window.innerWidth * 0.01}>
//       <Card
//         padding={window.innerWidth * 0.005}
//         radius='md'
//         style={{
//           backgroundColor: '#fff',
//           flexDirection: 'column',
//           alignItems: 'center',
//           justifyContent: 'start',
//           height: window.innerHeight * 0.15,
//           width: window.innerWidth * 0.12,
//           padding: window.innerHeight * (0.016),
//           display: 'flex',
//           textAlign: 'center'
//         }}
//       >
//         <Text color='#006089' size='md' weight='normal' align='center'>
//           Total Boarded
//         </Text>

//         <Box
//           style={{
//             color: '#006089',
//             backgroundColor: '#E0ECF0',
//             fontSize: '20px',
//             padding: window.innerHeight * (0.005),
//             borderRadius: '10px',
//             marginTop: window.innerHeight * (0.01),
//             width: '50%',
//             display: 'flex',
//             justifyContent: 'center',
//             alignItems: 'center'
//           }}
//         >
//           {data?.boarded_count || 0}
//         </Box>
//       </Card>
//       <Card
//         padding={window.innerWidth * 0.005}
//         radius='md'
//         style={{
//           backgroundColor: '#fff',
//           flexDirection: 'column',
//           alignItems: 'center',
//           justifyContent: 'start',
//           height: window.innerHeight * 0.15,
//           width: window.innerWidth * 0.12,
//           padding: window.innerHeight * (0.016),
//           display: 'flex',
//           textAlign: 'center'
//         }}
//       >
//         <Text color='#006089' size='md' weight='normal' align='center'>
//           Total Reconciled
//         </Text>

//         <Box
//           style={{
//             color: '#006089',
//             backgroundColor: '#E0ECF0',
//             fontSize: '20px',
//             padding: window.innerHeight * (0.005),
//             borderRadius: '10px',
//             marginTop: window.innerHeight * (0.01),
//             width: '50%',
//             display: 'flex',
//             justifyContent: 'center',
//             alignItems: 'center'
//           }}
//         >
//           {data?.reconciled_count || 0}
//         </Box>
//       </Card>
//       <Card
//         padding={window.innerWidth * 0.005}
//         radius='md'
//         style={{
//           backgroundColor: '#fff',
//           display: 'flex',
//           flexDirection: 'column',
//           alignItems: 'center',
//           justifyContent: 'start',
//           height: window.innerHeight * 0.15,
//           padding: window.innerHeight * (0.016),

//           width: window.innerWidth * 0.12,
//           textAlign: 'center'
//         }}
//       >
//         <Text color='#006089' size='md' weight='normal' align='center'>
//           Discrepancy
//         </Text>

//         <Box
//           style={{
//             color: 'red',
//             backgroundColor: '#E0ECF0',
//             fontSize: '20px',
//             padding: window.innerHeight * 0.005,
//             borderRadius: '10px',
//             marginTop: window.innerHeight * 0.01,
//             width: '50%',
//             display: 'flex',
//             justifyContent: 'center',
//             alignItems: 'center'
//           }}
//         >
//           {data?.discrepancy_count || 0}
//         </Box>
//       </Card>
//     </Box>
//   )
// }

// export default TotalCard;

// import { Card, Text, Box } from '@mantine/core';

// const TotalCard = (data) => {
//   return (
//     <Box pl={window.innerWidth * 0.01} style={{ display: 'flex', gap: '10px' }}>
//       {/* {cardDetails.map(({ header, key, color }) => ( */}
//         <Card
//         //   key={key}
//           padding={window.innerWidth * 0.005}
//           radius="md"
//           style={{
//             backgroundColor: '#fff',
//             flexDirection: 'column',
//             alignItems: 'center',
//             justifyContent: 'start',
//             height: window.innerHeight * 0.15,
//             width: window.innerWidth * 0.44,
//             padding: window.innerHeight * 0.016,
//             display: 'flex',
//             textAlign: 'center',
//           }}
//         >
//           <Text color="#006089" size="md" weight="normal" align="center">
//             {/* {title} */}
//           </Text>

//           <Box
//             style={{
//             //   color: color,
//               backgroundColor: '#E0ECF0',
//               fontSize: '20px',
//               padding: window.innerHeight * 0.005,
//               borderRadius: '10px',
//               marginTop: window.innerHeight * 0.01,
//               width: '55%',
//               display: 'flex',
//               justifyContent: 'center',
//               alignItems: 'center',
//             }}
//           >
//             {/* {count} */}
//           </Box>
//         </Card>
//       {/* ))} */}
//     </Box>
//   );
// };

// export default TotalCard;

import { Card, Text, Box } from '@mantine/core';
const TotalCard = ({ data, title }) => {
  return (
    <Box pl="25%" >
      <Card
        padding="xs"
        radius="md"
        style={{
          marginRight:window.innerWidth*0.01,
          backgroundColor: '#fff',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'start',
          height: '15vh',
          width: '100%', 
          display: 'flex',
          textAlign: 'center',
        }}
      >
        
        <Text color="#006089" size="md" weight="bold" align="center">
          {title}
        </Text>

        
        <Box
          style={{
            backgroundColor: '#E0ECF0',
            fontSize: '20px',
            padding: '8px', 
            borderRadius: '10px',
            marginTop: '8px',
            width: '35%',
            display: 'flex',
            justifyContent: 'center',
            height:'52%',
            alignItems: 'center',
          }}
        >
          {data || 0}
        </Box>
      </Card>
    </Box>
  );
};

export default TotalCard;

