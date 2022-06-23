import { createRouter, createWebHistory, RouteRecordRaw, NavigationGuard, RouteLocationNormalized } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import DashboardView from '../views/DashboardView.vue'
import OrdersView from '../views/OrdersView.vue'
import ColorsView  from '@/views/ColorsView.vue'
import ProductsHomeView from '@/views/products/ProductsHomeView.vue'
import ProductsView from '@/views/products/ProductsView.vue'
import CustomersView from '@/views/CustomersView.vue'
import UsersView from '@/views/UsersView.vue'
import CalculatorView from '@/views/CalculatorView.vue'
import CategoriesView from '@/views/CategoriesView.vue'
import AddProductView from '@/views/products/AddProductView.vue'
import UpdateProductView from '@/views/products/UpdateProductView.vue'
import DeleteProductView from '@/views/products/DeleteProductView.vue'
import PageNotFoundView from '@/views/PageNotFoundView.vue'
import { useUserStore } from '@/stores/UserStore'
import { Role } from '@/Types/Role';

const goToLoginIfNotAuthenticated = (to: RouteLocationNormalized, from: RouteLocationNormalized) => {
	const userStore = useUserStore();
	const isUserLoggedIn = userStore.isUserLoggedIn;
	if (!isUserLoggedIn  && from.name !== "Login") {
		return 'login';
	}
}

const goToHomeIfNotAdmin = (to: RouteLocationNormalized) => {
	const userStore = useUserStore();
	if (to.meta.requiresAuthentication && to.meta.requiresAdminRole && userStore.hasRole(Role.ADMIN)) {
		return '/';
	}
}
const routes: Array<RouteRecordRaw> = [
	{
		path: '/login',
		name: 'Login',
		component: LoginView
	},
	{
		path: '/',
		name: 'Dashboard',
		component: DashboardView,
		meta: {requiresAuthentication: true, isInNavbar: true},
		beforeEnter: [goToLoginIfNotAuthenticated]
	},
	{
		path: '/orders',
		name: 'Orders',
		component: OrdersView,
		meta: {requiresAuthentication: true, isInNavbar: true},
		beforeEnter: [goToLoginIfNotAuthenticated, goToHomeIfNotAdmin]
	},
	{
		path: '/products',
		name: 'Products',
		component: ProductsView,
		meta: {requiresAuthentication: true, isInNavbar: true},
		children: [
			{
				path: '',
				name: 'ProductsHome',
				meta: {requiresAuthentication: true},
				component: ProductsHomeView
			},
			{
				path: 'add-product',
				name: 'AddProduct',
				meta: {requiresAuthentication: true},
				component: AddProductView
			},
			{
				path: 'update-product/:id',
				name: 'UpdateProduct',
				meta: {requiresAuthentication: true},
				component: UpdateProductView
			},
			{
				path: '/delete-product/:id',
				name: 'DeleteProduct',
				meta: {requiresAuthentication: true},
				component: DeleteProductView
			}
		]
	},
	{
		path: '/colors',
		name: 'Colors',
		meta: {requiresAuthentication: true, isInNavbar: true},
		component: ColorsView
	},
	{
		path: '/categories',
		name: 'Categories',
		meta: {requiresAuthentication: true, isInNavbar: true},
		component: CategoriesView
	},
	{
		path: '/customers',
		name: 'Customers',
		meta: {requiresAuthentication: true, isInNavbar: true},
		component: CustomersView
	},
	{
		path: '/users',
		name: 'Users',
		meta: {requiresAuthentication: true, isInNavbar: true},
		component: UsersView
	},
	{
		path: '/calculator',
		name: 'Calculator',
		meta: {requiresAuthentication: true, isInNavbar: true},
		component: CalculatorView
	},
	{
		path: '/:pathMatch(.*)*',
		name: 'PageNotFound',
		component: PageNotFoundView
	}
	// {
	// 	path: '/products/add-product',
	// 	name: 'AddProductView',
	// 	component: AddProductView
	// },
	// {
	// 	path: '/products/update-product/:id',
	// 	name: 'UpdateProductView',
	// 	component: UpdateProductView
	// },
	// {
	// 	path: '/products/delete-product/:id',
	// 	name: 'DeleteProductView',
	// 	component: DeleteProductView
	// }
]


const router = createRouter({
	history: createWebHistory(process.env.BASE_URL),
	routes
})
export default router

