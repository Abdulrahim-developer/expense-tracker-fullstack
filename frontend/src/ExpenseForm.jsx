import React from 'react'

function ExpenseForm({onExpenseAdd}) {




const handleSubmit= async (e)=>{
   // 1. CRITICAL: Stop the browser from refreshing the page layout violently!
   e.preventDefault();
  // console.log(e.target.elements.title.value); just for testing how e got print

    // 2. Fetch the logged-in user's database ID key from localStorage
     const userId = localStorage.getItem('userId');

  const payload = Object.fromEntries(new FormData(e.target))
  
try {
  const reponse = await fetch('http://localhost:8080/expenses',{
    method:'POST',
    headers:{
      'Content-type':'application/json',
      // 3. SECURELY TAG THIS NEW EXPENSE WITH THE USER ID 
          'X-User-Id': userId 
    },
    body:JSON.stringify(payload)
  })

  if(reponse.ok){
    e.target.reset();
    if(onExpenseAdd){
      onExpenseAdd()
    }

  }
}
catch(error){
  console.error('failed to submit form ',error)
}

}


  return (



    <div>
        <h1>Expense form</h1>

        <form onSubmit={handleSubmit}>

           <div className='outer'>
             <label htmlFor="title">Title</label>
             <span className='break'>:</span>
            <input  name='title' type='text' required />
           </div>

            <div className='outer'>
             <label htmlFor="amount">Amount</label>
              <span className='break'>:</span>
            <input name='amount' type='Number' required min={1}/>
           </div>

            <div className='outer'>
             <label htmlFor="category">Category</label>
              <span className='break'>:</span>
            <select name="category" id="category">
  <option value="Food">Food</option>
  <option value="Travel">Travel</option>
  <option value="Shopping">Shopping</option>
  <option value='Bills'>Bills</option>
  <option value="Other">Other</option>
</select>
           </div>

           <button  >Submit</button>
           <button style={{marginLeft:'10px'}}>reset</button>
        </form>
    </div>
  )
}

export default ExpenseForm