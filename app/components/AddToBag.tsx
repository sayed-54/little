import { useShoppingCart } from "use-shopping-cart";
import { Button } from "@/components/ui/button";
import { urlfor } from "../lib/sanity";
import { useState } from "react";

interface AddToBagProps {
  currency: string;
  description: string;
  image: any;
  name: string;
  price: number;
  size: string | null;
  key: string;
}

const AddToBag: React.FC<AddToBagProps> = ({ currency, description, image, name, price, size }) => {
  const { addItem, handleCartClick } = useShoppingCart();
  const [showAlert, setShowAlert] = useState<boolean>(false);

  const handleAddToBag = () => {
    if (size) {
      addItem({
        id: `${name}-${size}`,
        name,
        price,
        currency,
        description,
        image: urlfor(image).url(),
        quantity: 1,
        size, // Add size to the item
      });
      handleCartClick();
    } else {
      setShowAlert(true);
    }
  };

  const closeAlert = () => {
    setShowAlert(false);
  };

  return (
    <>
      {showAlert && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md text-center">
            
            <p className="text-gray-600 text-lg">Please select a size before adding to bag.</p>
            <button onClick={closeAlert} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600">Close</button>
          </div>
        </div>
      )}
      <Button onClick={handleAddToBag}>
        Add to Bag
      </Button>
    </>
  );
};

export default AddToBag;
