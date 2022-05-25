import { createRouter, createWebHistory, RouteRecordRaw, NavigationGuard, RouteLocationNormalized } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import DashboardView from '../views/DashboardView.vue'
import OrdersView from '../views/OrdersView.vue'
import ColorsView  from '@/views/ColorsView.vue'
import ProductsView from '@/views/ProductsView.vue'
import CustomersView from '@/views/CustomersView.vue'
import UsersView from '@/views/UsersView.vue'
import CalculatorView from '@/views/CalculatorView.vue'
import AddProductView from '@/views/AddProductView.vue'
import UpdateProductView from '@/views/UpdateProductView.vue'
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
		path: '/',
		name: 'Dashboard',
		component: DashboardView,
		meta: {requiresAuthentication: true},
		beforeEnter: [goToLoginIfNotAuthenticated]
	},
	{
		path: '/login',
		name: 'Login',
		component: LoginView
	},
	{
		path: '/orders',
		name: 'Orders',
		component: OrdersView,
		meta: {requiresAuthentication: true},
		beforeEnter: [goToLoginIfNotAuthenticated, goToHomeIfNotAdmin]
	},
	{
		path: '/products',
		name: 'Products',
		component: ProductsView
	},
	{
		path: '/colors',
		name: 'Colors',
		component: ColorsView
	},
	{
		path: '/customers',
		name: 'Customers',
		component: CustomersView
	},
	{
		path: '/users',
		name: 'Users',
		component: UsersView
	},
	{
		path: '/calculator',
		name: 'Calculator',
		component: CalculatorView
	},
	{
		path: '/products/add-product',
		name: 'AddProductView',
		component: AddProductView
	},
	{
		path: '/products/update-product/:id',
		name: 'UpdateProductView',
		component: UpdateProductView
	}
]


const router = createRouter({
	history: createWebHistory(process.env.BASE_URL),
	routes
})
export default router

