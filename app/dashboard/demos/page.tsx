'use client';

import { findMaxPossibleSumeOfContiguousBalances } from "@/app/lib/data";
import React, { useState } from 'react';

const buttonStyle: React.CSSProperties = {
  backgroundColor: '#4CAF50', // Green background
  border: 'none',
  color: 'white',
  padding: '15px 32px',
  textAlign: 'center',
  textDecoration: 'none',
  display: 'inline-block',
  fontSize: '16px',
  margin: '4px 2px',
  cursor: 'pointer',
  borderRadius: '4px', // Rounded corners
};

const Page = () => {
  const [input, setInput] = useState('');
  const [secondInput, setSecondInput] = useState('');
  const [result, setResult] = useState<number | null>(null);
  const [result2, setResult2] = useState<number | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSecondInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSecondInput(e.target.value);
  };

  const handleSubmit = () => {
    // Parse both inputs to arrays of numbers
    const array = input.split(',').map(Number);
  
    // Check if the array length is within the constraints
    if (array.length <= 3 || array.length >= 10**5) {
      alert('The number of account balances must be more than 3 and less than 100,000.');
      return;
    }
  
    // Check if each account balance is within the constraints
    if (array.some(balance => balance <= -1000 || balance >= 1000)) {
      alert('Each account balance must be greater than -1000 and less than 1000.');
      return;
    }
  
    // Proceed if all constraints are met
    (async () => {
      try {
        const maxSum = await findMaxPossibleSumeOfContiguousBalances(array);
        setResult(maxSum);
      } catch (error) {
        console.error("Failed to calculate max sum:", error);
        // Handle the error appropriately
      }
    })();
  };

  /* We are filling a bucket with water that holds n cups. You can use a one cup or two cup measuring cup as you fill the bucket. 
  Calculate how many distinct ways you can use the measuring cups to fill the bucket.

  Constraints:
  Input – integer n where 1 < n < 50
Output – 32-bit integer */

    const handleBucketCups = () => {
        console.log('secondInput', secondInput);
        // Parse the input string to an array of numbers
        const n = parseInt(secondInput);
    
        // Check if the input is within the constraints
        if (n <= 1 || n >= 50) {
            alert('The number of cups must be more than 1 and less than 50.');
            return;
        }
    
        // Proceed if all constraints are met
        (async () => {
        try {
            // filling a bucket with water that holds n cups. You can use a 1 cup or 2 cup measuring cup as you fill the bucket. Calculate how many distinct ways you can use the measuring cups to fill the bucket.
            let distinctWaysToFillBucket = 0;
            let dp = new Array(n + 1).fill(0);
            dp[0] = 1;
            for (let i = 1; i <= n; i++) {
                dp[i] = dp[i - 1];
                if (i >= 2) {
                    dp[i] += dp[i - 2];
                }
            }
            distinctWaysToFillBucket = dp[n];
            console.log('distinctWaysToFillBucket', distinctWaysToFillBucket);
            setResult2(distinctWaysToFillBucket);
        } catch (error) {
            console.error("Failed to calculate the number of distinct ways:", error);
            // Handle the error appropriately
        }
        })();
    };

  return (
    <div>
      <h1>Max Sum of Contiguous Balances</h1>
      <input
        type="text"
        value={input}
        onChange={handleInputChange}
        placeholder="Enter numbers separated by commas"
      />
      <br />
      <button onClick={handleSubmit} style={buttonStyle}>Calculate Max Sum</button>
      {result !== null && <p>Max Possible Sum of Contiguous Balances: {result}</p>}
    <br /><br /><br />
      <h1>Calculate how many distinct ways you can use the measuring cups to fill the bucket of the size below. You can use one cup or two cup measuring cup as you fill it.</h1>
      <input
        type="text"
        value={secondInput}
        onChange={handleSecondInputChange}
        placeholder="Cups bucket can hold"
      />
      <br />
      <button onClick={handleBucketCups} style={buttonStyle}>Calculate distinct solutions</button>
      {result2 !== null && <p>Distint ways to fill the bucket: {result2}</p>}
    </div>



  );
};

export default Page;