import classes from "../../styles/Order.module.css"
import axios from "axios";
import { useEffect,useContext, useState } from "react";
import AuthContext from "../../stores/authContext"
import { useRouter } from "next/dist/client/router";
const CancelledOrders = ()=>{
    const router = useRouter()
    const [list, setList] = useState(null)
    const [customerOrders, setCustomerOrders] = useState(null)
    const token = useContext(AuthContext)
    useEffect(() =>{
        if(!token){
    router.push("/login")
  }else{
    router.push("/cancelledOrders")
  }
        const extractOrder =list=>{
            // console.log('list', list)
            var temp =[]
            list.map(item=>{
                var order = item.customerOrder
                console.log(item)
                if(!temp.includes(order)){
                    temp.push(order)
                }
            })
            setCustomerOrders(temp)
        }
        const getOrders =async ()=>{
            try {
                const res = await axios.get('http://localhost:4000/order/owners/cancelled',{
                    headers: {
                        "Access-Control-Allow-Origin" : "*",
                        'Content-Type': 'application/json',
                        'Authorization' : token
                    }
                })
                setList(res.data)
                extractOrder(res.data)
                
                }
            catch(e){
                console.log(e)
            }
        }
        getOrders()
        
    },[])
    return (
        <div className={classes.order}>
            <h1>Cancelled Orders</h1>
            {customerOrders?customerOrders.map(order=>{
                var orders = list.filter(item=>{
                    return item.customerOrder == order
                })
                var total = 0
                var items = 0
                for(let i in orders){
                    total = total +  (parseInt(orders[i].item.cost )* orders[i].quantity)
                    items = items + orders[i].quantity
                }
                return (
                    <div key={order._id} className={classes.box}>
                    <div className={classes.flex}>
                        <h3>{orders[0].customer.name}</h3>
                        <h5>Order amount: <span className={classes.color}>£{total}</span></h5>
    
                    </div>
    
                   <div className={classes.second}>
                    <div className={classes.flex}>
                        <h5>No.of items:{items}</h5>
                        <h5 className={classes.cancelled}> Order Cancelled </h5>
                    </div>
                    </div>
    
               
                </div>
                    )
            }):null}




        </div>
    )
}


export default CancelledOrders













