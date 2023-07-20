import React, {useState, useEffect} from 'react';
import './gallery.css';
import CloseIcon from '@mui/icons-material/Close';

const Gallery = () => {
    const [model, setModel] = useState(false);
    const [tempImgSrc, setTempImgSrc] = useState('');
    const [data, setData] = useState([]);

    useEffect(() => {
        // Load images from Local Storage
        const images = JSON.parse(localStorage.getItem('images')) || [];
        setData(images);
    }, []);

    const getImg = (imgSrc) => {
        setTempImgSrc(imgSrc);
        setModel(true);
        console.log(tempImgSrc);
    };

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        const id = data.length + 1;
        const imageURL = URL.createObjectURL(file);

        // Convert the image to base64 format
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result.split(',')[1];

            const newImage = {
                id,
                imageSrc: `data:image/jpeg;base64,${base64String}`, // Save base64 string instead of URL
            };

            // Save the uploaded image to Local Storage
            const images = [...data, newImage];
            localStorage.setItem('images', JSON.stringify(images));

            setData(images);
        };
        reader.readAsDataURL(file);
    };

    const handleDeleteImage = (id) => {
        const updatedImages = data.filter((item) => item.id !== id);
        localStorage.setItem('images', JSON.stringify(updatedImages));
        setData(updatedImages);
    };

    const handleAddDescription = (id) => {
        const description = prompt('Enter description for the image:');
        if (description !== null) {
            const updatedImages = data.map((item) =>
                item.id === id ? {...item, description} : item
            );
            localStorage.setItem('images', JSON.stringify(updatedImages));
            setData(updatedImages);
        }
    };

    return (
        <>
            <div className={model ? 'model open' : 'model'}>
                <img src={tempImgSrc} alt="Preview"/>
                <CloseIcon onClick={() => setModel(false)}/>
            </div>
            <div className="gallery">
                {data.length === 0 ? (
                    <p>No image found</p>
                ) : (
                    data.map((item) => (
                        <div className="pics" key={item.id} onClick={() => getImg(item.imageSrc)}>
                            <img src={item.imageSrc} style={{width: '100%'}} alt={`Image ${item.id}`}/>
                            <button className={'deleteBtn'} onClick={() => handleDeleteImage(item.id)}>Delete image
                            </button>
                            <div className="descriptionWrapper">
                                <button
                                    className={'addDescriptionBtn'}
                                    onClick={() => handleAddDescription(item.id)}
                                >
                                    Add Description
                                </button>
                                {item.description && <p>{item.description}</p>}
                            </div>
                        </div>
                    ))
                )}
            </div>
            <div className="file-input-wrapper">
                <label className="file-input">
                    Upload Image
                    <input type="file" accept="image/*" onChange={handleImageUpload}/>
                </label>
            </div>
        </>
    );
};

export default Gallery;



