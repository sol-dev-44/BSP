// utils/dateFormatters.ts

// Format a date string to a more user-friendly display
export const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    
    // If the date is invalid, return the original string
    if (isNaN(date.getTime())) {
      return dateString;
    }
    
    // Format options
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric',
      year: 'numeric'
    };
    
    return date.toLocaleDateString('en-US', options);
  };
  
  // Format a time string to 12-hour format
  export const formatTime = (timeString: string): string => {
    const date = new Date(timeString);
    
    // If the date is invalid, return the original string
    if (isNaN(date.getTime())) {
      return timeString;
    }
    
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit', 
      hour12: true 
    });
  };
  
  // Format a date range for display
  export const formatDateTimeRange = (startTime: string, endTime: string): string => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    
    // If either date is invalid, return a default string
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return `${startTime} - ${endTime}`;
    }
    
    const dateFormatted = start.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric' 
    });
    
    const startTimeFormatted = start.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit', 
      hour12: true 
    });
    
    const endTimeFormatted = end.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit', 
      hour12: true 
    });
    
    return `${dateFormatted}, ${startTimeFormatted} - ${endTimeFormatted}`;
  };