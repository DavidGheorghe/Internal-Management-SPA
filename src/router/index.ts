import { createRouter, createWebHistory, RouteRecordRaw, NavigationGuard, RouteLocationNormalized } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import DashboardView from '../views/DashboardView.vue'
import OrdersView from '../views/orders/OrdersView.vue'
import OrdersHomeView from '../views/orders/OrdersHomeView.vue'
import UpdateOrderView from '../views/orders/UpdateOrderView.vue'
import AddOrderView from '../views/orders/AddOrderView.vue'
import ColorsView  from '@/views/colors/ColorsView.vue'
import ColorsHomeView  from '@/views/colors/ColorsHomeView.vue'
import AddColorView  from '@/views/colors/AddColorView.vue'
import UpdateColorView  from '@/views/colors/UpdateColorView.vue'
import ProductsHomeView from '@/views/products/ProductsHomeView.vue'
import ProductsView from '@/views/products/ProductsView.vue'
import CustomersView from '@/views/customers/CustomersView.vue'
import CustomersHomeView from '@/views/customers/CustomersHomeView.vue'
import AddCustomerView from '@/views/customers/AddCustomerView.vue'
import UsersView from '@/views/UsersView.vue'
import ReportsView from '@/views/ReportsView.vue'
import AddProductView from '@/views/products/AddProductView.vue'
import UpdateProductView from '@/views/products/UpdateProductView.vue'
import PageNotFoundView from '@/views/PageNotFoundView.vue'
import { useUserStore } from '@/stores/UserStore'
import { Role } from '@/types/Role';
import { useIsCurrentUserAdmin, useIsCurrentUserSupervisor } from '@/composables/rolesComposables'
import { APIUrls } from '@/utils/APIURLs'

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
		meta: {requiresAuthentication: true, isInNavbar: true, requiredRoles: [Role[Role.ADMIN], Role[Role.EMPLOYEE], Role[Role.SUPERVISOR]]},
		beforeEnter: [goToLoginIfNotAuthenticated]
	},
	{
		path: '/orders',
		name: 'Orders',
		component: OrdersView,
		meta: {requiresAuthentication: true, isInNavbar: true, requiredRoles: [Role[Role.ADMIN], Role[Role.EMPLOYEE], Role[Role.SUPERVISOR]]},
		children: [
			{
				path: '',
				name: 'OrdersHome',
				meta: {requiresAuthentication: true},
				component: OrdersHomeView
			},
			{
				path: 'add-order',
				name: 'AddOrder',
				meta: {requiresAuthentication: true},
				component: AddOrderView
			},
			{
				path: 'update-order/:id',
				name: 'UpdateOrder',
				props: true,
				meta: {requiresAuthentication: true},
				component: UpdateOrderView
			}
		],
		beforeEnter: [goToLoginIfNotAuthenticated]
	},
	{
		path: '/products',
		name: 'Products',
		component: ProductsView,
		meta: {requiresAuthentication: true, isInNavbar: true, requiredRoles: [Role[Role.ADMIN], Role[Role.EMPLOYEE], Role[Role.SUPERVISOR]]},
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
			}
		],
		beforeEnter: [goToLoginIfNotAuthenticated]
	},
	{
		path: '/colors',
		name: 'Colors',
		meta: {requiresAuthentication: true, isInNavbar: true, requiredRoles: [Role[Role.ADMIN], Role[Role.EMPLOYEE], Role[Role.SUPERVISOR]]},
		component: ColorsView,
		children: [
			{
				path: '',
				name: 'ColorsHome',
				meta: {requiresAuthentication: true},
				component: ColorsHomeView
			},
			{
				path: 'add-color',
				name: 'AddColor',
				meta: {requiresAuthentication: true},
				component: AddColorView
			},
			{
				path: 'update-color/:id',
				name: 'UpdateColor',
				props: true, //route => ({id: Number(route.params.id)}),
				meta: {requiresAuthentication: true},
				component: UpdateColorView
			}
		],
		beforeEnter: [goToLoginIfNotAuthenticated]
	},
	// {
	// 	path: '/categories',
	// 	name: 'Categories',
	// 	meta: {requiresAuthentication: true, isInNavbar: true},
	// 	component: CategoriesView
	// },
	{
		path: '/customers',
		name: 'Customers',
		meta: {requiresAuthentication: true, isInNavbar: true, requiredRoles: [Role[Role.SUPERVISOR]]},
		component: CustomersView,
		children: [
			{
				path: '',
				name: 'CustomersHome',
				meta: {requiresAuthentication: true},
				component: CustomersHomeView
			},
			{
				path: 'add-customer',
				name: 'AddCustomer',
				meta: {requiresAuthentication: true},
				component: AddCustomerView
			}
		],
		beforeEnter: [goToLoginIfNotAuthenticated]
	},
	{
		path: '/reports',
		name: 'Reports',
		meta: {requiresAuthentication: true, isInNavbar: true, requiredRoles: [Role[Role.ADMIN], Role[Role.EMPLOYEE], Role[Role.SUPERVISOR]]},
		component: ReportsView,
		beforeEnter: [goToLoginIfNotAuthenticated]
	},
	{
		path: '/users',
		name: 'Users',
		meta: {requiresAuthentication: true, isInNavbar: true, requiredRoles: [Role[Role.ADMIN]]},
		component: UsersView,
		beforeEnter: [goToLoginIfNotAuthenticated]
	},
	{
		path: '/:pathMatch(.*)*',
		name: 'PageNotFound',
		component: PageNotFoundView
	}
]



const router = createRouter({
	history: createWebHistory(process.env.BASE_URL),
	routes
})

router.beforeEach((to, from) => {
	const userStore = useUserStore();

	if (to.meta.requiresAuthentication && userStore.isLoggedIn === false) {
		return {
			path: '/login',
			query: { redirect: to.fullPath}
		}
	}
});

declare module 'vue-router' {
	interface RouteMeta {
		requiresAuthentication: boolean,
		isInNavbar?: boolean,
		requiredRoles?: string[]
	}
}

export default router

