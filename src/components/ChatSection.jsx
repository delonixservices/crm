// import React, { useRef } from 'react';
// import { 
//   Box, 
//   Typography, 
//   List, 
//   ListItem, 
//   ListItemText, 
//   TextField, 
//   Button, 
//   Divider 
// } from '@mui/material';
// import dayjs from 'dayjs';

// const ChatSection = ({ messages = [], newMessage, setNewMessage, handleAddMessage }) => {
//   const chatContainerRef = useRef(null);

//   return (
//     <Box>
//       <Typography
//         variant="h5"
//         gutterBottom
//         sx={{
//           fontWeight: 'bold',
//           color: '#1a1a1a',
//           mb: 2
//         }}
//       >
//         Messages
//       </Typography>
      
//       <Box
//         ref={chatContainerRef}
//         sx={{
//           maxHeight: "300px",
//           overflowY: "auto",
//           border: "1px solid #e0e0e0",
//           borderRadius: "8px",
//           padding: "16px",
//           marginBottom: "16px",
//           backgroundColor: '#f9f9f9'
//         }}
//       >
//         <List>
//           {messages.length === 0 ? (
//             <Typography
//               variant="body2"
//               sx={{ color: 'text.secondary' }}
//               align="center"
//             >
//               No messages yet
//             </Typography>
//           ) : (
//             messages.map((message, index) => (
//               <React.Fragment key={index}>
//                 <ListItem
//                   sx={{ 
//                     backgroundColor: index % 2 === 0 ? '#f0f0f0' : 'white',
//                     borderRadius: 2,
//                     mb: 1
//                   }}
//                 >
//                   <ListItemText
//                     primary={
//                       <Typography
//                         variant="body1"
//                         sx={{ color: '#333', fontWeight: 'medium' }}
//                       >
//                         {message.message}
//                       </Typography>
//                     }
//                     secondary={
//                       <Typography
//                         variant="caption"
//                         sx={{ color: '#666' }}
//                       >
//                         {dayjs(message.timestamp).format("DD MMM YYYY, HH:mm")}
//                       </Typography>
//                     }
//                   />
//                 </ListItem>
//                 {index < messages.length - 1 && <Divider variant="inset" />}
//               </React.Fragment>
//             ))
//           )}
//         </List>
//       </Box>

//       <Box sx={{ display: 'flex', gap: 2 }}>
//         <TextField
//           variant="outlined"
//           label="Type your message"
//           value={newMessage}
//           onChange={(e) => setNewMessage(e.target.value)}
//           fullWidth
//           multiline
//           maxRows={4}
//           sx={{
//             '& .MuiOutlinedInput-root': {
//               backgroundColor: 'white',
//               color: '#333'
//             }
//           }}
//         />
//         <Button
//           variant="contained"
//           color="primary"
//           onClick={handleAddMessage}
//           sx={{ 
//             fontWeight: 'bold',
//             boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
//             alignSelf: 'flex-start',
//             mt: 1
//           }}
//         >
//           Send
//         </Button>
//       </Box>
//     </Box>
//   );
// };

// export default ChatSection;



import React, { useRef, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  List, 
  ListItem, 
  ListItemText, 
  TextField, 
  Button, 
  Divider,
  Chip
} from '@mui/material';
import dayjs from 'dayjs';

const ChatSection = ({ messages = [], newMessage, setNewMessage, handleAddMessage }) => {
  const chatContainerRef = useRef(null);
  
  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <Box>
      <Typography
        variant="h5"
        gutterBottom
        sx={{
          fontWeight: 'bold',
          color: '#1a1a1a',
          mb: 2
        }}
      >
        Messages
      </Typography>
      
      <Box
        ref={chatContainerRef}
        sx={{
          maxHeight: "300px",
          overflowY: "auto",
          border: "1px solid #e0e0e0",
          borderRadius: "8px",
          padding: "16px",
          marginBottom: "16px",
          backgroundColor: '#f9f9f9'
        }}
      >
        <List>
          {messages.length === 0 ? (
            <Typography
              variant="body2"
              sx={{ color: 'text.secondary' }}
              align="center"
            >
              No messages yet
            </Typography>
          ) : (
            messages.map((message, index) => (
              <React.Fragment key={index}>
                <ListItem
                  sx={{ 
                    backgroundColor: message.importedFromExcel ? '#fff3e0' : (index % 2 === 0 ? '#f0f0f0' : 'white'),
                    borderRadius: 2,
                    mb: 1,
                    flexDirection: 'column',
                    alignItems: 'flex-start'
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5, width: '100%' }}>
                    <Chip 
                      label={message.user}
                      size="small"
                      sx={{ 
                        mr: 1,
                        backgroundColor: message.user.toLowerCase().includes('agent') ? '#e3f2fd' : '#f3e5f5'
                      }}
                    />
                    {message.importedFromExcel && (
                      <Chip 
                        label="Imported"
                        size="small"
                        variant="outlined"
                        sx={{ mr: 1 }}
                      />
                    )}
                  </Box>
                  <ListItemText
                    primary={
                      <Typography
                        variant="body1"
                        sx={{ 
                          color: '#333',
                          fontWeight: 'medium',
                          ml: 1
                        }}
                      >
                        {message.message}
                      </Typography>
                    }
                    secondary={
                      <Typography
                        variant="caption"
                        sx={{ 
                          color: '#666',
                          ml: 1
                        }}
                      >
                        {dayjs(message.timestamp).format("DD MMM YYYY, HH:mm")}
                      </Typography>
                    }
                  />
                </ListItem>
                {index < messages.length - 1 && <Divider variant="fullWidth" />}
              </React.Fragment>
            ))
          )}
        </List>
      </Box>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <TextField
          variant="outlined"
          label="Type your message"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleAddMessage();
            }
          }}
          fullWidth
          multiline
          maxRows={4}
          sx={{
            '& .MuiOutlinedInput-root': {
              backgroundColor: 'white',
              color: '#333'
            }
          }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddMessage}
          sx={{ 
            fontWeight: 'bold',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            alignSelf: 'flex-start',
            mt: 1
          }}
        >
          Send
        </Button>
      </Box>
    </Box>
  );
};

export default ChatSection;