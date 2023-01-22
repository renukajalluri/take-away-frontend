import classes from "../../styles/ProfileForm.module.css"
import {useFormik} from "formik"
import Image from "next/image";
import axios from "axios";
import * as Yup from "yup"
import AuthContext from "../../stores/authContext"
import { useEffect,useContext, useState } from "react";
import Box from '@mui/material/Box';
import Radio from '@mui/material/Radio';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import { faCircleArrowUp } from "@fortawesome/free-solid-svg-icons";
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Modal from '@mui/material/Modal';
import ImageUploading from "react-images-uploading";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";


const style = {
    position: 'absolute' ,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 23,
    p: 4,
  };
  
  const validationSchema = Yup.object({
    itemName:Yup.string().required("Required"),
    itemDesc:Yup.string().required("Required"),
    itemCost:Yup.string().required("Required"),

  })
  

const Edit  = ({token,item,getMenuList})=>{
    const [loading, setLoading] = useState(false)
    const [itemImg,setItemImg] = useState([{data_url : item.image}]);
    const [available, setAvailable] = useState(true)
    const [open, setOpen] = useState(false);


    const imageMaxNumber = 1
 const itemOnChange = (imageList,addUpdateIndex)=>{
  setItemImg(imageList)
 }

 const handleOpen = () =>{
  console.log("click")
    setOpen(true)    
   };
  const handleClose = () => setOpen(false); 
  const  onSubmit = async(values,actions)=>{
   
    console.log(values)

    setLoading(true)
    const restoFormData = {
      name:values.itemName,
      description:values.itemDesc,
      cost:values.itemCost,
      available:available,
      image :itemImg[0].data_url
    }
    try {
      const response = await axios.put(`http://localhost:4000/menu/${item._id}`,
      JSON.stringify(restoFormData),{
        headers:{
          "Access-Control-Allow-Origin" : "*",
          'Content-Type': 'application/json',
          'Authorization' : token
        }
      }
      )
      console.log(response)
      
      setLoading(false)
      actions.resetForm()
      setItemImg(null)
      setAvailable(true)
      handleClose()
      getMenuList()
    } catch (error) {
      console.log(error)
    }
  }

  const formik = useFormik({
    initialValues:{
        itemName:item?item.name:"",
        itemDesc:item?item.description:"",
        itemCost:item?item.cost:"",
        itemImg:item?item.image:"",
        // available:
  },
  // enableReinitialize: true,
    validationSchema,
    onSubmit,
    validateOnMount:true,
    validateOnBlur:true,
    validateOnChange:true
   })

 return(<>
                            <Modal
                                        open={open}
                                        onClose={handleClose}
                                        aria-labelledby="modal-modal-title"
                                        aria-describedby="modal-modal-description"
                                    >
                                        <Box sx={style}>
                                            <form onSubmit={formik.handleSubmit}>
                                        <div className={classes['form-control']}>
                                            <label htmlFor='itemName'>Item Name</label>
                                            <input 
                                            type="text" 
                                            name="itemName" 
                                            id="itemName" 
                                            placeholder="Item Name"
                                            onChange={formik.handleChange} 
                                            value={formik.values.itemName}
                                            onBlur={formik.handleBlur}
                                            />
                                    {formik.touched.itemName&& formik.errors.itemName?<p className={classes.error}>{formik.errors.itemName}</p>:null}
                        </div>

                        <div className={classes['form-control']}>
                                            <label htmlFor='itemDesc'>Item Description</label>
                                            <input 
                                            type="text" 
                                            name="itemDesc" 
                                            id="itemDesc" 
                                            placeholder="Item Description"
                                            onChange={formik.handleChange} 
                                            value={formik.values.itemDesc}
                                            onBlur={formik.handleBlur}
                                            />
                                    {formik.touched.itemDesc && formik.errors.itemDesc?<p className={classes.error}>{formik.errors.itemDesc}</p>:null}
                        </div>


                        <div className={classes['form-control']}>
                                            <label htmlFor='itemCost'>Item Cost</label>
                                            <input 
                                            type="text" 
                                            name="itemCost" 
                                            id="itemCost" 
                                            placeholder="Item Cost"
                                            onChange={formik.handleChange} 
                                            value={formik.values.itemCost}
                                            onBlur={formik.handleBlur}
                                            />
                                    {formik.touched.itemCost && formik.errors.itemCost?<p className={classes.error}>{formik.errors.itemCost}</p>:null}
                        </div>

                        <div className={classes["form-control"]}>
                                <label htmlFor="banner">Item Image</label>
                                <ImageUploading
                                //  multiple
                                maxNumber={imageMaxNumber}
                                    value={itemImg}
                                    onChange={itemOnChange}
                                    dataURLKey="data_url"
                                    acceptType={["jpg","svg","jpeg"]}
                                >
                                    {({
                                    imageList,
                                    onImageUpload,
                                    onImageUpdate,
                                    onImageRemove,
                                    isDragging,
                                    dragProps
                                    })=>(
                                    <div>
                                        
                                        <button className={classes.banner} onClick={onImageUpload}
                                        {...dragProps}
                                        >
                                        Select Image  <span>
                                        <FontAwesomeIcon icon={faCircleArrowUp} />
                                        </span>
                                        </button>
                                    
                                    {/* <img src={itemImg.data_url} alt="" /> */}
                                    
                                    
                                    {/* {itemImg.length>=1 ?<button className={classes.remove} onClick={onImageRemoveAll}>Remove all images</button> :null} */}
                                    {imageList.map((image, index) => (
                            <div key={index} > 
                                <div className={classes["image-item"]}>
                                {/* objectFit='contain' layout="fill" */}
                                {/* style={{width:"100px", height:"100px"}} */}
                                <img  src={image.data_url}  alt='menuImage'   /> 
                                </div> 
                                <div className={classes["image-item__btn-wrapper"]}>
                                <button onClick={() => onImageUpdate(index)}>Update</button> 
                                <button onClick={() => onImageRemove(index)}>Remove</button> 
                                </div> 
                            </div> 
                            ))} 

                                    </div>
                                    )}

                                </ImageUploading>
                        </div>

                        <div className={classes['form-control']}>
                        <Box>
                            <FormControl  id="job-experience-group-label">
                                <FormLabel style={{color:"#212121"}}>Available</FormLabel>
                            <RadioGroup   row name="job-experience-group" aria-labelledby="job-experience-group-label">
                                <FormControlLabel
                                onChange={e=>setAvailable(e.target.value)} 
                                //  onChange={formik.handleChange} 
                                //  value={formik.values.available}
                                //  onBlur={formik.handleBlur}
                                control={<Radio  />} 
                                //  name="available" 
                                label="Yes" 
                                value={true}
                                />
                                    {/* {formik.touched.yes && formik.errors.yes ?<p className={classes.error}>{formik.errors.yes}</p>:null} */}
                                <FormControlLabel 
                                onChange={e=>setAvailable(e.target.value)} 
                                //  value={formik.values.no}
                                // value={formik.values.available}
                                //  onBlur={formik.handleBlur}
                                control={<Radio/>} 
                                //  name="available" 
                                label="No" 
                                value={false} 
                                />
                                {/* {formik.touched.no && formik.errors.no ?<p className={classes.error}>{formik.errors.no}</p>:null} */}

                            </RadioGroup>
                            </FormControl>
                        </Box>

                        </div>
        

                        <div className={classes["modal-save"]} >
                                    <button type="submit"  disabled={!formik.isValid || formik.isSubmitting }  onSubmit={onSubmit}>Save</button>
                                    </div>
                        </form>
                                        
                        </Box>
                      </Modal>

                      {item.available?  <div className={classes['menu-box']}>
        <div className={classes['item-details']}>
          <div className={classes['item']}>
            <span className={classes['item-img']}>
              <img src={item.image} alt="" />
            </span>
            <div className={classes['item-fields']}>
              <span className={classes.itemName}>{item.name}</span>
              <span className={classes.itemDesc}>{item.description}</span>
              <span className={classes.available}>Available</span>
            </div>
          </div>
          <div className={classes['item-ea']}>
            <div className={classes['edit-icon']}>
              <FontAwesomeIcon onClick={handleOpen} icon={faPenToSquare} />
            </div>

            <h6 className={classes['item-amount']}>Amount: £{item.cost} </h6>
          </div>
        </div>
      </div>: <div className={classes['menu-box']}>
        <div className={classes['item-details']}>
          <div className={classes['item']}>
            <span className={classes['item-img']}>
              <img src={item.image} alt="" />
            </span>
            <div className={classes['item-fields']}>
              <span className={classes.itemName}>{item.name}</span>
              <span className={classes.itemDesc}>{item.description}</span>
              <span className={classes.Notavailable}>Not Available</span>
            </div>
          </div>
          <div className={classes['item-ea']}>
            <div className={classes['edit-icon']}>
              <FontAwesomeIcon onClick={handleOpen} icon={faPenToSquare} />
            </div>

            <h6 className={classes['item-amount']}>Amount: £{item.cost} </h6>
          </div>
        </div>
      </div>}
        </>
    
 )
    
}
    


export default Edit