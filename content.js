const ordersArray = [];
const statusElement = 'div[class="mpof_ki myre_8v mwdn_1 m389_6m"]';
const purchaseDateElement = 'div[class="mp0t_0a mgn2_12 mqu1_16 mli8_k4 mgmw_3z mp4t_4 mryx_0"]';
const productsElement = 'section[id^="offer-row-"]';
const productNameElement = 'div[class="mpof_ki mr3m_1 mjyo_6x gel0f g1s2l g69b4 mh36_0"]';
const qtyPriceElement = 'div[class="mpof_ki mr3m_1 mjyo_6x gel0f g1ow0 gqp1d mgmw_3z"]';
const productsTotalElement = "div[class='mpof_ki mr3m_1 mjyo_6x gel0f g1ow0 gqp1d m7f5_0a mx4z_5x munh_56 mzmg_f9']";
const purchaseTotalElement = 'span[class="mli8_k4 msa3_z4 mqu1_1 mp0t_0a mgmw_qw mgn2_14"]';

const orders = document.querySelectorAll('[id^="group-id-"]')

orders.forEach(order => {
    const status = order.querySelector(statusElement).textContent.trim();
    const date = order.querySelector(purchaseDateElement).textContent.trim();

    const products = Array.from(order.querySelectorAll(productsElement)).map(productSection => {
        const name = productSection.querySelector(productNameElement).textContent.trim();
        const qtyPrice = productSection.querySelector(qtyPriceElement).textContent.trim();
        const total = productSection.querySelector(productsTotalElement).textContent.trim();
        
        return { name, qtyPrice, total };
    });

    const totalPrice = order.querySelector(purchaseTotalElement).textContent.trim();

    ordersArray.push({
        date,
        status,
        products,
        totalPrice
    });
});

chrome.runtime.sendMessage({ type: 'STORE_ORDERS', ordersArray }, response => {
    if (response && response.status === 'success') {
        console.log("Orders array successfully sent to background.js");
    }
});
