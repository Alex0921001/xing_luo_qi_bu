import { Router } from 'express'
import autoRouter from './auto'
import homeRouter from './home'
import noautoRouter from './noauto'
import userRouter from './user'
import settingsRouter from './settings'

const router = Router()

router.use('/auto', autoRouter)
router.use('/home', homeRouter)
router.use('/noauto', noautoRouter)
router.use('/user', userRouter)
router.use('/settings', settingsRouter)

export default router
